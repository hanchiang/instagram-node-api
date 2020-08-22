/* eslint-disable object-property-newline */
import crypto from 'crypto';

import { BASE_URL } from '../constants';

// referer is based on url path for some operations
export function instagramHttpHeaders(xInstagramGIS: string, username: string) {
  return {
    'x-instagram-gis': xInstagramGIS,
    referer: `${BASE_URL}/${username}/`,
  };
}

// queryVariables = stringified JSON
export const getInstagramGISHash = (
  queryVariables: string,
  rhxGis: any = undefined
) =>
  crypto
    .createHash('md5')
    .update(`${rhxGis}:${queryVariables}`, 'utf8')
    .digest('hex');

/* Get query variables for various operations  */
// Get the profile of a page
export function getProfileVariables(userId: string) {
  return JSON.stringify({
    user_id: `${userId}`,
    include_chaining: true,
    include_reel: true,
    include_suggested_users: true,
    include_logged_out_extras: false,
    include_highlight_reels: true,
  });
}

// Get the media of a page
export function getProfileMediaVariables(
  userId: string,
  num: number = 12,
  endCursor: string = ''
) {
  return JSON.stringify({
    id: `${userId}`,
    first: num,
    after: endCursor,
  });
}

export function getProfileFollowersVariables(userId: string, num: number = 12) {
  return JSON.stringify({
    id: userId,
    include_reel: false,
    first: num,
  });
}

export function getProfileFollowingVariables(userId: string, num: number = 12) {
  return JSON.stringify({
    id: userId,
    include_reel: false,
    first: num,
  });
}
