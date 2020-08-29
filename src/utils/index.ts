import { logger } from './logging';
import { UnauthCookie } from '../types/insta';

export * from './insta';
export * from './masks';
export * from './file';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns an integer in the range [min, max)
 * @param {int} min
 * @param {int} max
 */
export function randomInt(min: number = 300, max: number = 1500) {
  return Math.round(Math.random() * (max - min) + min);
}

export const prettyPrintJson = (json: any) => JSON.stringify(json, null, 2);

export const parseJson = (jsonString: string) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(JSON.parse(jsonString));
    }, 0)
  );

export const formatCookieString = (cookieObject): string => {
  let result = '';
  for (const key of Object.keys(cookieObject)) {
    result += `${key}=${cookieObject[key]}; `;
  }
  result = result.substring(0, result.length - 2);
  return result;
};

/**
 * Receives an array of cookie values, returns an object with `cookieNames` as the keys
 * @param cookieArray
 */
export const extractCookie = (cookieArray, cookieNames = []) => {
  if (!cookieNames || cookieNames.length === 0) {
    logger.warn(
      `Trying to extract cookie without a valid 'cookieNames' parameter: ${cookieNames}`
    );
  }
  const result = {};

  /**
   * [
   *  'ig_did=379C2FE0-039B-4973-9C36-CDB710F48611; Domain=.instagram.com; expires=Mon, 26-Aug-2030 13:25:26 GMT; HttpOnly; Max-Age=315360000; Path=/; Secure'
   * ]
   */
  for (const cookie of cookieArray) {
    const [key, value] = cookie.split(';', 1)[0].split('=');
    if (cookieNames.indexOf(key) !== -1) {
      result[key] = value;
    }
  }
  return result as UnauthCookie;
};
