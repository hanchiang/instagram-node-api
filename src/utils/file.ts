import fs from 'fs';
import { promisify } from 'util';

import numeral from 'numeral';
import moment from 'moment';

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const _readFile = promisify(fs.readFile);
const _writeFile = promisify(fs.writeFile);

import { MOMENT_FORMAT } from '../constants';

const ENCODING = 'utf8';

/**
 * Creates folder if it doesn't exist
 */
export async function handleCreateFolder(paths: string[]) {
  for (const filepath of paths) {
    try {
      await access(filepath);
    } catch (err) {
      await mkdir(filepath);
      console.log(`Folder is created at ${filepath}`);
    }
  }
}

export async function readFile(filepath: string) {
  try {
    await access(filepath);
    const data = await _readFile(filepath, ENCODING);
    return data.split('\n');
  } catch (err) {
    throw new Error("Please create a file 'input.txt' in the 'input' folder");
  }
}

/**
 *
 * @param {string} filepath
 * @param {string} data
 */
export function writeFile(filepath: string, data: string) {
  return _writeFile(filepath, data)
    .then(() => console.log(`Written to file: ${filepath}`))
    .catch((err) => {
      throw err;
    });
}

export function getOutputFilePath(
  numFollowers: number,
  averageLikes: number,
  averageComments: number
) {
  const follower = numeralNumberformat(numFollowers);
  const likes = numeral(Math.round(averageLikes)).format(
    numeralNumberformat(averageLikes)
  );
  const comments = numeral(Math.round(averageComments)).format(
    numeralNumberformat(averageComments)
  );
  const now = moment().format(MOMENT_FORMAT);

  const format = `${follower}-${likes}-${comments}-${now}`;
  return `${numeral(numFollowers).format(format)}.csv`;
}

// eslint-disable-next-line consistent-return
const numeralNumberformat = (number: number) => {
  if (number < 1000) return '0a';
  if (number < 10000) return '0.0a';
  if (number < 1000000) return '0a';
  if (number >= 1000000) return '0.0a';
};
