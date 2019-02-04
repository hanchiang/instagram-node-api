const instaUtils = require('./insta');
const masks = require('./masks');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns an integer in the range [min, max)
 * @param {int} min
 * @param {int} max
 */
function randomInt(min = 100, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const prettyPrintJson = json => JSON.stringify(json, null, 2);

const parseJson = jsonString => new Promise(
  resolve => setTimeout(resolve(JSON.parse(jsonString)), 0)
);

module.exports = {
  ...instaUtils,
  ...masks,
  sleep,
  randomInt,
  prettyPrintJson,
  parseJson
};
