/* eslint-disable object-property-newline */
const crypto = require('crypto');

const { BASE_URL } = require('../constants');

// TODO: referer is based on url path for some operations
function httpHeaders(xInstagramGIS, username) {
  return {
    'x-instagram-gis': xInstagramGIS,
    referer: `${BASE_URL}/${username}/`,
  };
}

// queryVariables = stringified JSON
const getInstagramGISHash = (rhxGis, queryVariables) => crypto
  .createHash('md5')
  .update(`${rhxGis}:${queryVariables}`, 'utf-8').digest('hex');

/* Get query variables for various operations  */
// Get the profile of a page
function getProfileVariables(userId) {
  return JSON.stringify({
    user_id: `${userId}`,
    include_chaining: true,
    include_reel: true,
    include_suggested_users: true,
    include_logged_out_extras: false,
    include_highlight_reels: true
  });
}

// Get the media of a page
function getProfileMediaVariables(userId, num = 12, endCursor = '') {
  return JSON.stringify({
    id: `${userId}`,
    first: num,
    after: endCursor
  });
}

function getProfileFollowersVariables(userId, num = 12) {
  return JSON.stringify({
    id: userId,
    include_reel: false,
    first: num
  });
}

function getProfileFollowingVariables(userId, num = 12) {
  return JSON.stringify({
    id: userId,
    include_reel: false,
    first: num
  });
}


module.exports = {
  httpHeaders, getInstagramGISHash, getProfileVariables,
  getProfileMediaVariables, getProfileFollowersVariables, getProfileFollowingVariables,
};
