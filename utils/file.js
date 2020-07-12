const fs = require('fs');
const { promisify } = require('util');

const numeral = require('numeral');
const moment = require('moment');

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const _readFile = promisify(fs.readFile);
const _writeFile = promisify(fs.writeFile);

const { MOMENT_FORMAT } = require('../constants');

const ENCODING = 'utf8';

/**
 * Creates folder if it doesn't exist
 * @param {string []} paths
 */
async function handleCreateFolder(paths) {
  for (const filepath of paths) {
    try {
      await access(filepath);
    } catch (err) {
      await mkdir(filepath);
      console.log(`Folder is created at ${filepath}`);
    }
  }
}

/**
 *
 * @param {string} filepath
 */
async function readFile(filepath) {
  try {
    await access(filepath);
    const data = await _readFile(filepath, ENCODING);
    return data.split('\n');
  } catch (err) {
    throw new Error('Please create a file \'input.txt\' in the \'input\' folder');
  }
}

/**
 *
 * @param {string} filepath
 * @param {string} data
 */
function writeFile(filepath, data) {
  return _writeFile(filepath, data)
    .then(() => console.log(`Written to file: ${filepath}`))
    .catch(err => { throw err; });
}

function getOutputFilePath(numFollowers, averageLikes, averageComments) {
  const follower = numeralNumberformat(numFollowers);
  const likes = numeral(Math.round(averageLikes)).format(numeralNumberformat(averageLikes));
  const comments = numeral(Math.round(averageComments)).format(numeralNumberformat(averageComments));
  const now = moment().format(MOMENT_FORMAT);

  const format = `${follower}-${likes}-${comments}-${now}`;
  return `${numeral(numFollowers).format(format)}.csv`;
}

// eslint-disable-next-line consistent-return
const numeralNumberformat = (number) => {
  if (number < 1000) return '0a';
  if (number < 10000) return '0.0a';
  if (number < 1000000) return '0a';
  if (number >= 1000000) return '0.0a';
};


module.exports = {
  handleCreateFolder, readFile, writeFile, getOutputFilePath
};
