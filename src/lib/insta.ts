import htmlparser from 'htmlparser2';
import _ from 'lodash';
import { AxiosResponse } from 'axios';

import { User } from '../types/model';
import { ProfileStats } from '../types/model';
import Api from '../config';
import apiErrorTransform from '../utils/apiErrorTransform';

import {
  parseJson,
  getProfileMediaVariables,
  getInstagramGISHash,
  httpHeaders,
  randomInt,
  sleep,
  postMask,
  commentMask,
} from '../utils';

import {
  NUM_TO_SCRAPE,
  PROFILE_MEDIA_QUERY_HASH,
  GRAPHQL_URL,
  MAX_MEDIA_PER_SCRAPE,
  NUM_TO_CALC_AVERAGE_ENGAGEMENT,
  VIRAL_THRESHOLD,
} from '../constants';

/**
 *
 * @param {string} username
 * @param {object} headers
 */
export async function fetchProfile(username: string, headers: any = {}) {
  try {
    const result = await Api.get(`/${username}`, { headers });
    return result;
  } catch (e) {
    throw apiErrorTransform(e);
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
 * Retrieve user's info from window._sharedData
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
    headers: httpHeaders(xInstagramGIS, username),
  };
  try {
    const res: AxiosResponse = await Api.get(`/${url}`, config);
    return res.data;
  } catch (e) {
    throw apiErrorTransform(e);
  }
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
 *
 * @param {string} id
 * @param {string} username
 */
// TODO: posts type
export async function downloadPosts(
  userId: string,
  username: string
): Promise<any[]> {
  const allPosts: any[] = [];
  let scrapeCount = 0;

  let result = await getProfileMedia(MAX_MEDIA_PER_SCRAPE, userId, username);
  const posts = result.data.user.edge_owner_to_timeline_media;

  let { page_info: pageInfo, edges } = posts;

  scrapeCount += edges.length;
  appendPosts(allPosts, edges);

  while (pageInfo.has_next_page && scrapeCount < NUM_TO_SCRAPE) {
    const wait = randomInt(100, 400);
    await sleep(wait);

    result = await getProfileMedia(
      MAX_MEDIA_PER_SCRAPE,
      userId,
      username,
      pageInfo.end_cursor
    );
    ({
      page_info: pageInfo,
      edges,
    } = result.data.user.edge_owner_to_timeline_media);

    scrapeCount += edges.length;
    appendPosts(allPosts, edges);
  }

  return allPosts.map((post: any) => {
    const resultPost = {
      ..._.pick(post, postMask),
      edge_media_to_comment: _.pick(post.edge_media_to_comment, commentMask),
    };
    return resultPost;
  });
}

/**
 * Calculate average and median engagement of specified most recent posts
 * @param {array} posts
 * @return {ProfileStats}
 */
// TODO: posts type
export function calcProfileStats(posts: any[]): ProfileStats {
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

  return {
    averageLikes,
    averageComments,
  };
}

export function getViralContent(averageLikes: number) {
  // TODO: post type
  return function (post: any): boolean {
    return (
      post.edge_media_preview_like.count > (1 + VIRAL_THRESHOLD) * averageLikes
    );
  };
}
