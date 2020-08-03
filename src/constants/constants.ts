/* eslint-disable object-property-newline */

export const ENCODING = 'utf8';
export const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
export const COMMON_HEADERS = {
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9',
  dnt: 1,
  // referer: <path>
  'user-agent': USER_AGENT,
  'x-requested-with': 'XMLHttpRequest',
};

export const MOMENT_FORMAT = 'YYYYMMDD-HH:mm:ss';

// URLS
export const BASE_URL = 'https://www.instagram.com';
export const POST_URL = 'https://www.instagram.com/p';
export const GRAPHQL_URL = 'graphql/query/?';
export const QUERY_ID = '17888483320059182';

// App constants
export const VIRAL_THRESHOLD = 1;
export const NUM_TO_SCRAPE = process.env.NODE_ENV === 'test' ? 100 : 500;
export const NUM_TO_CALC_AVERAGE_ENGAGEMENT = 20;
export const MIN_FOLLOWER = 15000;
export const MIN_POSTS = 100;

// Instagram imposed constants and limits
export const PROFILE_QUERY_HASH = '7c16654f22c819fb63d1183034a5162f';
export const PROFILE_MEDIA_QUERY_HASH = 'f2405b236d85e8296cf30347c9f08c2a';
export const PROFILE_FOLLOWERS_QUERY_HASH = '7dd9a7e2160524fd85f50317462cff9f';
export const PROFILE_FOLLOWING_QUERY_HASH = 'c56ee0ae1f89cdbd1c89e2bc6b8f3d18';
export const MAX_MEDIA_PER_SCRAPE = 50;
