import {
  fetchProfile,
  retrieveUserWebInfo,
  downloadPosts,
  calculateEngagementRate,
  getViralContent,
} from '../lib/insta';

import { User } from '../types/model';
import { throwError, ErrorStatus } from '../utils/error';

import { NUM_TO_CALC_AVERAGE_ENGAGEMENT } from '../constants';
import { upsertUser } from '../services';
import { logger } from '../utils/logging';

/**
 * 1. Retrieve user profile page
 * 2. Retrieve user shared data and web data under `window._sharedData` in the html source
 * 3. Make requests to instagram API to get the media of a user
 * 4. Calculate statistics(average likes, average comments of the latest 12 posts) of user
 * 5. Filter media for viral posts
 */
export const getUserMedia = async (req, res) => {
  const { username } = req.params;

  // 1. Retrieve user profile page
  logger.debug(`Retrieving profile url user: ${username}`);
  const profileRes = (await fetchProfile(username)) as string;

  // 2. Retrieve user shared data and web data under `window._sharedData` in the html source
  logger.debug(`Retrieving info of user: ${username}`);
  const {
    userSharedData,
    userWebData,
    ...user
  }: User = await retrieveUserWebInfo(profileRes);
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
    return throwError({
      message: `@${user.username} is private`,
      status: ErrorStatus.BAD_REQUEST,
    });
  }
  if (user.numPosts < NUM_TO_CALC_AVERAGE_ENGAGEMENT) {
    return throwError({
      message: `@${user.username} has ${user.numPosts} posts, which is fewer than the required ${NUM_TO_CALC_AVERAGE_ENGAGEMENT} posts`,
      status: ErrorStatus.BAD_REQUEST,
    });
  }

  const posts = await downloadPosts(user.id, user.username);
  const { averageLikes, averageComments } = calculateEngagementRate(posts);

  // Update user in db
  user.averageLikes = averageLikes;
  user.averageComments = averageComments;

  const viralPosts = getViralContent(posts, averageLikes);

  res.json({
    payload: { ...user, viralPosts },
  });

  await upsertUser(user, posts);
};
