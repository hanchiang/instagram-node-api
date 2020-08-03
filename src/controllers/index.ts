import {
  fetchProfile,
  retrieveUserWebInfo,
  downloadPosts,
  calcProfileStats,
  getViralContent,
} from '../lib/insta';

import { User } from '../types/model';

import { NUM_TO_CALC_AVERAGE_ENGAGEMENT } from '../constants';
import { upsertUser } from '../services';

export const getUserMedia = async (req, res) => {
  const { username } = req.params;

  const { data: profileRes } = await fetchProfile(username);
  let user: User = await retrieveUserWebInfo(profileRes);

  if (user.isPrivate) {
    return res.send('User is private');
  }
  if (user.numPosts < NUM_TO_CALC_AVERAGE_ENGAGEMENT) {
    return res.send(
      `User has ${user.numPosts} posts, which is fewer than the required ${NUM_TO_CALC_AVERAGE_ENGAGEMENT} posts`
    );
  }

  const posts = await downloadPosts(user.id, user.username);
  const { averageLikes, averageComments } = calcProfileStats(posts);

  // Update user in db
  user = {
    ...user,
    averageLikes,
    averageComments,
  };

  const viralPosts = posts.filter(getViralContent(averageLikes));

  res.json({ ...user, viralPosts });

  await upsertUser(user, posts);
};
