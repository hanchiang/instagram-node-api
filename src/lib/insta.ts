import querystring from 'querystring';

import htmlparser from 'htmlparser2';
import _ from 'lodash';
import { ApiResponse } from 'apisauce';

import { User } from '../types/model';
import { ProfileStats } from '../types/model';
import { UnauthCookie, AuthCookie } from '../types/insta';
import { extractCookie } from '../utils';
import { transformApiError } from '../utils/error';
import { logger } from '../utils/logging';
import Api from './api';

import {
  parseJson,
  getProfileMediaVariables,
  getInstagramGISHash,
  instagramHttpHeaders,
  randomInt,
  sleep,
  postMask,
  commentMask,
  formatCookieString,
} from '../utils';

import { generateEncPassword } from '../utils/insta';

import {
  NUM_TO_SCRAPE,
  PROFILE_MEDIA_QUERY_HASH,
  GRAPHQL_URL,
  MAX_MEDIA_PER_SCRAPE,
  NUM_TO_CALC_AVERAGE_ENGAGEMENT,
  VIRAL_THRESHOLD,
  POST_URL,
} from '../constants';

async function getHome() {
  const result = await Api.get('/', {
    headers: {
      referer: 'https://www.google.com',
    },
  });
  if (result.ok) {
    return result;
  }
  throw transformApiError(result);
}

export async function getUnauthenticatedCookies(): Promise<UnauthCookie> {
  const { headers } = await getHome();
  const cookieArray = headers['set-cookie'];

  return extractCookie(cookieArray, ['ig_did', 'csrftoken', 'mid']);
}

/**
 * Retrieve data like `rollout_hash`, `encryption`, `device_id`
 */
export async function getSharedData() {
  const result = await Api.get('/data/shared_data/');
  if (result.ok) {
    return result.data;
  }
  throw transformApiError(result);
}

/**
 * Log in a user, retrieve values in 'set-cookie' and 'x-ig-set-www-claim' header
 * @param request
 */
export async function login(request): Promise<AuthCookie> {
  const {
    username,
    password,
    publicKeyId,
    publicKey,
    encryptionVersion,
    cookieObj: unauthCookie,
    rolloutHash,
  }: {
    username: string;
    password: string;
    publicKeyId: string;
    publicKey: string;
    encryptionVersion: string;
    cookieObj: UnauthCookie;
    rolloutHash: string;
  } = request;

  const params = {
    username,
    enc_password: generateEncPassword({
      password,
      publicKeyId,
      publicKey,
      encryptionVersion,
    }),
    queryParams: '{}',
    optIntoOneTap: false,
  };

  logger.debug(`logging in @${username}`);

  const result: any = await Api.post(
    `/accounts/login/ajax/`,
    querystring.stringify(params),
    {
      headers: {
        'x-csrftoken': unauthCookie.csrftoken, // required
        'x-instagram-ajax': rolloutHash, // required?
        'x-ig-app-id': '936619743392459', // required?
        'x-ig-www-claim': 0, // required?
        'content-type': 'application/x-www-form-urlencoded',
        accept: '*/*',
        cookie: formatCookieString(unauthCookie), // required
        referer: 'https://www.instagram.com/',
        origin: 'https://www.instagram.com',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
    }
  );

  // Should return a non-zero value if login succeeds
  const xIgWwwClaim = result.headers['x-ig-set-www-claim'];
  if (result.ok) {
    // data: { user: false, authenticated: false, status: 'ok' }
    // data: { user: true, authenticated: false, status: 'ok' }
    // TODO: hmmm.. unable to get authenticated: true. Something is missing
    logger.info(result.data);
    if (!result.data.authenticated) {
      logger.warn(
        `Login for @${username} succeeds but 'authenticated' is false`
      );
    }
    const cookieArray = result.headers['set-cookie'];
    const authCookie = extractCookie(cookieArray, ['sessionid', 'ds_user_id']);
    const cookie: AuthCookie = {
      ...unauthCookie,
      ...authCookie,
      'x-ig-www-claim': xIgWwwClaim,
    };
    logger.debug(cookie);
    return cookie;
  }
  throw transformApiError(result);
}

/**
 * Log in a user, use the credentials to fetch profile
 * @param request
 */
export async function loginAndFetchProfile(request) {
  const { username, password, encryption, cookieObj, rolloutHash } = request;
  const {
    key_id: publicKeyId,
    public_key: publicKey,
    version: encryptionVersion,
  } = encryption;

  const cookie: AuthCookie = await login({
    username,
    password,
    publicKeyId,
    publicKey,
    encryptionVersion,
    cookieObj,
    rolloutHash,
  });

  const profileRes = await fetchProfile(username, {
    cookie: formatCookieString(cookie),
  });
  return profileRes;
}

/**
 *
 * @param {string} username
 * @param {object} headers
 */
export async function fetchProfile(
  username: string,
  headers = {}
): Promise<string> {
  const result = await Api.get(`/${username}`, { headers });
  if (result.ok) {
    return result.data as string;
  }
  if (result.status === 404) {
    throw transformApiError(result, `@${username} is not found`);
  }
}

/**
 * Helps to parse window._sharedData to retrieve user's info
 * @param {string} data
 */
function retrieveUserWebInfoHelper(data: string): Promise<User> {
  return new Promise((resolve, reject) => {
    let seenSharedData = false;

    const parser = new htmlparser.Parser({
      onopentag(name: string, attribs: any) {
        // eslint-disable-next-line no-empty
        if (name === 'script' && attribs.type === 'text/javascript') {
        }
      },
      async ontext(text: string) {
        const textToScan = 'window._sharedData = ';
        if (text.substring(0, textToScan.length) === textToScan) {
          // window._sharedData = {.......};"
          const regex = /window\._sharedData = (.*);/;
          const match = text.match(regex);
          if (match) {
            const userSharedData: any = await parseJson(match[1]);
            seenSharedData = true;

            const { user } = userSharedData.entry_data.ProfilePage[0].graphql;

            const res: User = {
              id: user.id,
              username: user.username,
              fullname: user.full_name,
              numPosts: user.edge_owner_to_timeline_media.count,
              numFollowers: user.edge_followed_by.count,
              numFollowing: user.edge_follow.count,
              isPrivate: user.is_private,
              isVerified: user.is_verified,
              profilePicUrl: user.profile_pic_url,
              isBusinessAccount: user.is_business_account,
              businessCategory: user.business_category_name,
              businessEmail: user.business_email,
              businessPhone: user.business_phone_number,
              businessAddress: user.business_address_json,
              csrfToken: userSharedData.config.csrf_token,
              countryCode: userSharedData.country_code,
              languageCode: userSharedData.language_code,
              locale: userSharedData.locale,
              userSharedData,
              userWebData:
                userSharedData.entry_data.ProfilePage[0].graphql.user,
            };
            resolve(res);
          } else {
            reject(new Error("Oops! Unable to find user's web data"));
          }
        }
      },
      onend() {
        if (seenSharedData) {
          reject(new Error('Not matched'));
        }
      },
    });
    parser.write(data);
    parser.end();
  });
}

/**
 * Retrieve user's info from `window._sharedData`
 * @param {string} data from fetchProfile
 */
export async function retrieveUserWebInfo(data: string): Promise<User> {
  try {
    return await retrieveUserWebInfoHelper(data);
  } catch (err) {
    throw new Error('Oops! Error occurred while retrieving user web info');
  }
}

/**
 * Instagram's graphql endpoint for getting user's media
 * @param {int} numMedia
 * @param {string} endCursor
 */
export async function getProfileMedia(
  numMedia: number,
  userId: string,
  username: string,
  endCursor: string = ''
): Promise<any> {
  const queryVariables = getProfileMediaVariables(userId, numMedia, endCursor);
  const xInstagramGIS = getInstagramGISHash(queryVariables);

  // https://www.instagram.com/graphql/query/?query_hash=${hash}&variables=${encoded JSON string variables}
  const url = `${GRAPHQL_URL}query_hash=${PROFILE_MEDIA_QUERY_HASH}&variables=${encodeURIComponent(
    queryVariables
  )}`;
  const config = {
    headers: instagramHttpHeaders(xInstagramGIS, username),
  };
  const res: ApiResponse<any> = await Api.get(`/${url}`, config);
  if (res.ok) {
    return res.data;
  }
  throw transformApiError(res);
}

/**
 * Adds post to list of posts
 * @param {array} edges
 * @param {array} allPosts
 */
// TODO: posts type
export function appendPosts(allPosts: any[], edges: any[]): void {
  for (const edge of edges) {
    const { node } = edge;
    allPosts.push(node);
  }
}

/**
 * Retrieve and return user media
 * @param {string} userId
 * @param {string} username
 */
// TODO: posts type
export async function downloadPosts(
  userId: string,
  username: string
): Promise<any[]> {
  const { allPosts } = await _downloadPosts(userId, username);

  return allPosts.map((post: any) => {
    const resultPost = {
      ..._.pick(post, postMask),
      edge_media_to_comment: _.pick(post.edge_media_to_comment, commentMask),
    };
    return resultPost;
  });
}

export async function _downloadPosts(userId, username) {
  const allPosts: any[] = [];
  let scrapeCount = 0;

  logger.debug(`Accessing media data of user: ${username}`);
  let profileMediaResult = await getProfileMedia(
    MAX_MEDIA_PER_SCRAPE,
    userId,
    username
  );
  const posts = profileMediaResult.data.user.edge_owner_to_timeline_media;

  let { page_info: pageInfo, edges } = posts;

  appendPosts(allPosts, edges);
  scrapeCount += edges.length;
  logger.debug('Current scrape count:', scrapeCount);

  while (pageInfo.has_next_page && scrapeCount < NUM_TO_SCRAPE) {
    const wait = randomInt(500, 1500);
    logger.debug(`Sleeping for ${wait / 1000} seconds`);
    await sleep(wait);

    profileMediaResult = await getProfileMedia(
      MAX_MEDIA_PER_SCRAPE,
      userId,
      username,
      pageInfo.end_cursor
    );
    ({
      page_info: pageInfo,
      edges,
    } = profileMediaResult.data.user.edge_owner_to_timeline_media);

    scrapeCount += edges.length;
    appendPosts(allPosts, edges);
    logger.debug('Current scrape count:', scrapeCount);
  }
  logger.debug(`Number of media scraped: ${scrapeCount}`);
  return {
    allPosts,
    profileMediaResult,
  };
}

/**
 * Calculate average and median engagement of specified most recent posts
 * @param {array} posts
 * @return {ProfileStats}
 */
// TODO: posts type
export function calculateEngagementRate(posts: any[]): ProfileStats {
  let totalLikes = 0;
  let totalComments = 0;
  let averageLikes = 0;
  let averageComments = 0;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < NUM_TO_CALC_AVERAGE_ENGAGEMENT; i++) {
    totalLikes += posts[i].edge_media_preview_like.count;
    totalComments += posts[i].edge_media_to_comment.count;
  }
  averageLikes = totalLikes / NUM_TO_CALC_AVERAGE_ENGAGEMENT;
  averageComments = totalComments / NUM_TO_CALC_AVERAGE_ENGAGEMENT;

  logger.debug(
    `average likes: ${averageLikes}, average comments: ${averageComments}`
  );

  // TODO:
  //   // get median
  //   likes.sort((a, b) => a - b);
  //   comments.sort((a, b) => a - b);
  //   [userViral.medianLikes, userViral.medianComments] = [likes, comments].map(
  //     (arr) => {
  //       const len = arr.length;
  //       if (len % 2 === 0) {
  //         return (arr[len / 2 - 1] + arr[len / 2]) / 2;
  //       }
  //       return arr[len / 2];
  //     }
  //   );

  return {
    averageLikes,
    averageComments,
  };
}

// TODO: post type
/**
 * Filter for viral posts, sort by number of likes, comments in descending order
 */
export function getViralContent(allPosts: any[], averageLikes: number) {
  const viralPosts = allPosts.filter((post: any): boolean => {
    return (
      post.edge_media_preview_like.count > (1 + VIRAL_THRESHOLD) * averageLikes
    );
  });
  logger.debug(`Number of viral posts: ${viralPosts.length}`);

  return viralPosts.map(transformPost).sort(viralPostSorter);
}

function transformPost(post) {
  return {
    // Refer to `utils/masks.txt`
    id: post.id,
    userId: post.owner.id,
    isVideo: post.is_video,
    videoViews: post.video_view_count,
    numComments: post.edge_media_to_comment.count,
    numLikes: post.edge_media_preview_like.count,
    url: `${POST_URL}/${post.shortcode}`,
    mediaSource: post.is_video ? post.video_url : post.display_url,
    captions: post.edge_media_to_caption.edges,
    commentsDisabled: post.comments_disabled,
    takenAt: post.taken_at_timestamp,
    dimension: post.dimensions,
    location: post.location,
  };
}

function viralPostSorter(post1, post2): number {
  if (post1.numLikes > post2.numLikes) return -1;
  if (post1.numLikes < post2.numLikes) return 1;
  if (post1.numComments > post2.numComments) return -1;
  if (post1.numComments < post2.numComments) return 1;
  return 0;
}
