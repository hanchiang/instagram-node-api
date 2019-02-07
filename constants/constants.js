/* eslint-disable object-property-newline */

const ENCODING = 'utf8';
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
const COMMON_HEADERS = {
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9',
  dnt: 1,
  // referer: <path>
  'user-agent': USER_AGENT,
  'x-requested-with': 'XMLHttpRequest'
};

// URLS
const BASE_URL = 'https://www.instagram.com/';
const POST_URL = 'https://www.instagram.com/p/';
const GRAPHQL_URL = 'graphql/query/?';
const QUERY_ID = '17888483320059182';

// App constants
const VIRAL_THRESHOLD = 1;
const NUM_TO_SCRAPE = process.env.NODE_ENV === 'test' ? 100 : 500;
const NUM_TO_CALC_AVERAGE_ENGAGEMENT = 20;
const MIN_FOLLOWER = 15000;
const MIN_POSTS = 100;

// Instagram imposed constants and limits
const PROFILE_QUERY_HASH = '7c16654f22c819fb63d1183034a5162f';
const PROFILE_MEDIA_QUERY_HASH = 'f2405b236d85e8296cf30347c9f08c2a';
const PROFILE_FOLLOWERS_QUERY_HASH = '7dd9a7e2160524fd85f50317462cff9f';
const PROFILE_FOLLOWING_QUERY_HASH = 'c56ee0ae1f89cdbd1c89e2bc6b8f3d18';
const MAX_MEDIA_PER_SCRAPE = 50;

module.exports = {
  ENCODING, BASE_URL, POST_URL, GRAPHQL_URL, QUERY_ID,
  VIRAL_THRESHOLD, NUM_TO_SCRAPE, NUM_TO_CALC_AVERAGE_ENGAGEMENT, MIN_FOLLOWER, MIN_POSTS,
  PROFILE_QUERY_HASH, PROFILE_MEDIA_QUERY_HASH, PROFILE_FOLLOWERS_QUERY_HASH,
  PROFILE_FOLLOWING_QUERY_HASH, MAX_MEDIA_PER_SCRAPE, USER_AGENT, COMMON_HEADERS
};
