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
export function randomInt(min: number = 100, max: number = 1000) {
  return Math.round(Math.random() * (max - min) + min);
}

export const prettyPrintJson = (json: any) => JSON.stringify(json, null, 2);

export const parseJson = (jsonString: string) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(JSON.parse(jsonString));
    }, 0)
  );
