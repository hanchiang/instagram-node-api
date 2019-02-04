const htmlparser = require('htmlparser2');
const _ = require('lodash');

const Api = require('../config');
const apiErrorTransform = require('../utils/apiErrorTransform');

const {
  parseJson, getProfileMediaVariables, getInstagramGISHash, httpHeaders,
  randomInt, sleep, postMask, commentMask
} = require('../utils');

const {
  NUM_TO_SCRAPE, PROFILE_MEDIA_QUERY_HASH, GRAPHQL_URL, MAX_MEDIA_LIMIT,
  NUM_TO_CALC_AVERAGE_ENGAGEMENT, VIRAL_THRESHOLD
} = require('../constants');


/**
 *
 * @param {string} username
 * @param {object} headers
 */
function fetchProfile(username, headers = {}) {
  return Api.get(`/${username}`, { headers }).catch(apiErrorTransform);
}


/**
 * Helps to parse window._sharedData to retrieve user's info
 * @param {string} data
 */
function retrieveUserWebInfoHelper(data) {
  return new Promise((resolve, reject) => {
    let seenSharedData = false;

    const parser = new htmlparser.Parser({
      onopentag(name, attribs) {
        // eslint-disable-next-line no-empty
        if (name === 'script' && attribs.type === 'text/javascript') { }
      },
      async ontext(text) {
        const textToScan = 'window._sharedData = ';
        if (text.substring(0, textToScan.length) === textToScan) {
          const regex = /window\._sharedData = (.*);/;
          const match = text.match(regex);
          if (match) {
            const userSharedData = await parseJson(match[1]);
            seenSharedData = true;

            const { user } = userSharedData.entry_data.ProfilePage[0].graphql;

            const res = {
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
              businessCategoryName: user.business_category_name,
              businessEmail: user.business_email,
              businessPhoneNumber: user.business_phone_number,
              businessAddressJson: user.business_address_json,
              rhxGis: userSharedData.rhx_gis,
              csrfToken: userSharedData.config.csrf_token,
              countryCode: userSharedData.country_code,
              languageCode: userSharedData.language_code,
              locale: userSharedData.locale
            };
            resolve(res);
          } else {
            reject(new Error('Oops! Unable to find user\'s web data'));
          }
        }
      },
      onend() {
        if (seenSharedData) {
          reject(new Error('Not matched'));
        }
      }
    });
    parser.write(data);
    parser.end();
  });
}

/**
 * Retrieve user's info from window._sharedData
 * @param {string} data from fetchProfile
 */
async function retrieveUserWebInfo(data) {
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
async function getProfileMedia(numMedia, id, username, rhxGis, endCursor = '') {
  const queryVariables = getProfileMediaVariables(id, numMedia, endCursor);
  const xInstagramGIS = getInstagramGISHash(rhxGis, queryVariables);

  // https://www.instagram.com/graphql/query/?query_hash=${hash}&variables=${encoded JSON string variables}
  const url = `${GRAPHQL_URL}query_hash=${PROFILE_MEDIA_QUERY_HASH}&variables=${encodeURIComponent(queryVariables)}`;
  const config = {
    headers: httpHeaders(xInstagramGIS, username)
  };
  const res = await Api.get(`/${url}`, config).catch(apiErrorTransform);
  return res.data;
}

/**
 * Adds post to list of posts
 * @param {array} edges
 * @param {array} allPosts
 */
function appendPosts(allPosts, edges) {
  for (const edge of edges) {
    const { node } = edge;
    allPosts.push(node);
  }
}

/**
 *
 * @param {string} id
 * @param {string} rhxGis
 * @param {string} username
 */
async function downloadPosts(id, rhxGis, username) {
  const allPosts = [];
  let scrapeCount = 0;

  let result = await getProfileMedia(MAX_MEDIA_LIMIT, id, username, rhxGis);
  const posts = result.data.user.edge_owner_to_timeline_media;

  let { page_info: pageInfo, edges } = posts;

  scrapeCount += edges.length;
  appendPosts(allPosts, edges);

  while (pageInfo.has_next_page && scrapeCount < NUM_TO_SCRAPE) {
    const wait = randomInt(100, 400);
    await sleep(wait);

    result = await getProfileMedia(MAX_MEDIA_LIMIT, id, username, rhxGis, pageInfo.end_cursor);
    ({ page_info: pageInfo, edges } = result.data.user.edge_owner_to_timeline_media);

    scrapeCount += edges.length;
    appendPosts(allPosts, edges);
  }

  return allPosts.map(post => {
    const resultPost = {
      ..._.pick(post, postMask),
      edge_media_to_comment: _.pick(post.edge_media_to_comment, commentMask)
    };
    return resultPost;
  });
}


/**
 * Calculate average and median engagement of specified most recent posts
 * @param {array} posts
 */
function calcProfileStats(posts) {
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
    averageLikes, averageComments
  };
}

function getViralContent(averageLikes) {
  return function (post) {
    return (post.edge_media_preview_like.count > (1 + VIRAL_THRESHOLD) * averageLikes);
  };
}

module.exports = {
  fetchProfile, retrieveUserWebInfo, downloadPosts, calcProfileStats, getViralContent
};
