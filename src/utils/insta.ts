/* eslint-disable object-property-newline */
import crypto from 'crypto';
import { default as _tweetnacl } from 'tweetnacl';

const tweetnacl: any = _tweetnacl;
tweetnacl.sealedbox = require('tweetnacl-sealedbox-js');

import { BASE_URL } from '../constants';

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

function encrypt({ password, publicKey, publicKeyId }) {
  const time = Date.now();
  const key = crypto.pseudoRandomBytes(32);
  const iv = Buffer.alloc(12, 0);
  const cipher = crypto
    .createCipheriv('aes-256-gcm', key, iv)
    .setAAD(Buffer.from(time.toString()));
  const aesEncrypted = Buffer.concat([
    cipher.update(Buffer.from(password)),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const encryptedKey = tweetnacl.sealedbox.seal(
    key,
    Buffer.from(publicKey, 'hex')
  );
  return {
    encrypted: Buffer.concat([
      Buffer.from([
        1,
        Number(publicKeyId),
        encryptedKey.byteLength & 255,
        (encryptedKey.byteLength >> 8) & 255,
      ]),
      encryptedKey,
      authTag,
      aesEncrypted,
    ]).toString('base64'),
    time: time / 1000,
  };
}

/**
 * source: EncryptionUtils.js
 e.encryptAndFormat = function(t, n) {
  const o = r(d[0]).getKeyId() , u = r(d[0]).getPublicKey() , c = r(d[0]).getVersion();
  if (null == o || null == u)
    throw new Error('Encryption Failure: failed to retrieve keyId and/or publicKey');
  return r(d[1]).encryptPassword(+o, u, c, t, n)
*/

// o = key id, u = public key, c = version, t = username, n = password

/**
 * 
e.encryptPassword = async function(t, c, n, o, s) {
  const u = r(d[0]).decodeUTF8(o), f = r(d[0]).decodeUTF8(s), y = await r(d[1]).encrypt(t, c, u, f);
  return r(d[2]).default(r(d[0]).encodeBase64(y), s, n)
}
*/

// t = key id, c = public key, n = version, o = username, s = password

/**
 * Refer to https://github.com/FeezyHendrix/Insta-mass-account-creator/issues/140#issuecomment-601788881
 */
export function generateEncPassword({
  password,
  publicKey,
  publicKeyId,
  encryptionVersion,
}) {
  const { encrypted, time } = encrypt({ password, publicKey, publicKeyId });
  const encryptedPassword = `#PWD_INSTAGRAM_BROWSER:${encryptionVersion}:${time}:${encrypted}`;
  return encodeURIComponent(encryptedPassword);
}
