import path from 'path';
import fs from 'fs';

import axios from 'axios';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

import {
  handleCreateFolder,
  readFile,
  writeFile,
  getOutputFilePath,
  prettyPrintJson,
  sleep,
  randomInt,
} from '../../utils';

import { transformApiError } from '../../utils/error';

import { USER_AGENT, NUM_TO_CALC_AVERAGE_ENGAGEMENT } from '../../constants';

import { User } from '../../types/model';

import {
  fetchProfile,
  retrieveUserWebInfo,
  _downloadPosts,
  calculateEngagementRate,
  getViralContent,
} from '../../lib/insta';
import { logger } from '../../utils/logging';

const OUTPUT_FOLDER = 'output';
const INPUT_FOLDER = 'input';

axios.defaults.headers.common['user-agent'] = USER_AGENT;

// To run: npm run build && node dist/commands/scrape/index.js

async function main() {
  const rescrape = false;
  await handleCreateFolder([
    path.join(__dirname, INPUT_FOLDER),
    path.join(__dirname, OUTPUT_FOLDER),
  ]);

  if (!rescrape) {
    const inputfile = path.join(__dirname, `${INPUT_FOLDER}/input.txt`);
    const usernames = await readFile(inputfile);

    for (const username of usernames) {
      const wait = randomInt(500, 1500);
      await _scrapeUser(username);
      console.log(`Sleeping for ${wait / 1000} second\n`);
      await sleep(wait);
    }
  } else {
    const directories = getDirectories(OUTPUT_FOLDER);
    await rescrapeAllUsers(directories);
  }
}

async function rescrapeAllUsers(directories) {
  for (const username of directories) {
    await _scrapeUser(username);
  }
  console.log('All done!');
}

/**
 * 1. Retrieve user profile page
 * 2. Retrieve user shared data and web data under `window._sharedData` in the html source
 * 3. Make requests to instagram API to get the media of a user
 * 4. Calculate statistics(average likes, average comments of the latest 12 posts) of user
 * 5. Filter media for viral posts
 * 6. Save viral content to file
 * Step 1 to 5 will be handled by `lib/insta.ts`
 */
async function _scrapeUser(username: string) {
  if (username == null || username.length === 0) {
    return;
  }
  try {
    // 1. Retrieve profile page
    logger.debug(`Retrieving profile url user: ${username}`);
    const profileRes = (await fetchProfile(username)) as string;

    // 2. Retrieve user shared data and web data under `window._sharedData` in the html source
    logger.debug(`Retrieving info of user: ${username}`);
    const {
      userSharedData,
      userWebData,
      ...user
    }: User = await retrieveUserWebInfo(profileRes);

    // Under `window._sharedData` in profile page(View source)
    await writeSampleFile('user_shared_data_sample.txt', userSharedData);
    // User public account info
    await writeSampleFile('user_web_data_sample.txt', userWebData);

    logger.debug(
      `@${user.username} has ${user.numPosts} posts, ${
        user.numFollowers
      } followers, ${user.numFollowing} following, is business account: ${
        user.isBusinessAccount ? 'yes' : 'no'
      }, country code: ${user.countryCode}, language code: ${
        user.languageCode
      }, locale: ${user.locale}`
    );

    if (user.isPrivate) {
      console.log(`${user.username} is private. Skipping...`);
      return;
    }
    if (user.numPosts < NUM_TO_CALC_AVERAGE_ENGAGEMENT) {
      console.log(
        `${user.username} has ${user.numPosts} posts, which is fewer than the required ${NUM_TO_CALC_AVERAGE_ENGAGEMENT} posts. Skipping...`
      );
      return;
    }

    // 3. Make graphql request to get media data of a profile and append to `posts`
    const posts = await downloadPosts(user);

    // 4. Calculate profile stats
    const { averageLikes, averageComments } = calculateEngagementRate(posts);
    user.averageLikes = averageLikes;
    user.averageComments = averageComments;

    // 5. Get viral content
    const viralPosts = getViralContent(posts, averageLikes);

    // 6. Save viral content to file
    await saveViralContent(user, viralPosts);

    logger.debug(`Completed work for ${user.username}!`);
  } catch (err) {
    throw transformApiError(err);
  }
}

/**
 *
 * @param {boolean} isVideo
 */
function getSinglePostByType(posts: any[], opt: any = {}) {
  const { isVideo = false } = opt;

  return posts.find((post) => isVideo === post.is_video);
}

/**
 * Retrieve and return user media
 * Write sample results to file
 * @param {User} user
 */
async function downloadPosts(user: User) {
  const { allPosts, profileMediaResult } = await _downloadPosts(
    user.id,
    user.username
  );

  await writeSampleFile('profile_media_sample.txt', profileMediaResult);

  const imagePost = getSinglePostByType(allPosts);
  if (imagePost) {
    await writeSampleFile('image_post_sample.txt', imagePost);
  }
  const videoPost = getSinglePostByType(allPosts, { isVideo: true });
  if (videoPost) {
    await writeSampleFile('video_post_sample.txt', videoPost);
  }
  return allPosts;
}

async function saveViralContent(user: User, viralPosts: any[]) {
  await writeSampleFile('viral_posts_sample.txt', viralPosts);

  const header = [
    { id: 'isVideo', title: 'Is video?' },
    { id: 'numLikes', title: 'Likes' },
    { id: 'numComments', title: 'Comments' },
    { id: 'url', title: 'Post URL' },
    { id: 'mediaSource', title: 'Media source' },
  ];

  await handleCreateFolder([
    path.join(__dirname, OUTPUT_FOLDER, user.username),
  ]);

  const filename = getOutputFilePath(
    user.numFollowers,
    user.averageLikes,
    user.averageComments
  );
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, OUTPUT_FOLDER, user.username, filename),
    header,
  });

  return csvWriter
    .writeRecords(viralPosts)
    .then(() => console.log(`Viral posts saved to file: ${filename}`))
    .catch((error) => console.log(error));
}

/**
 * Utilities
 */
function getDirectories(source) {
  return fs
    .readdirSync(source)
    .map((file) => path.join(__dirname, source, file))
    .filter(isDirectory)
    .map((directory) => {
      if (path.sep === '\\') return directory.split('\\')[1];
      return directory.split('/')[1];
    });
}

function isDirectory(source) {
  return fs.statSync(source).isDirectory();
}

async function writeSampleFile(filename: string, data: any) {
  const folderPath = path.join(__dirname, 'sample');
  await handleCreateFolder([folderPath]);
  await writeFile(path.join(folderPath, filename), prettyPrintJson(data));
}

module.exports = main;

if (require.main === module) {
  main().catch(console.error);
}
