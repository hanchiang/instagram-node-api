const {
  fetchProfile, retrieveUserWebInfo, downloadPosts, calcProfileStats, getViralContent
} = require('../lib/insta');

const { NUM_TO_CALC_AVERAGE_ENGAGEMENT } = require('../constants');
const { upsertUser } = require('../services');

exports.getUserMedia = async (req, res) => {
  const { username } = req.params;

  const { data: profileRes } = await fetchProfile(username);
  let user = await retrieveUserWebInfo(profileRes);

  if (user.isPrivate) {
    return res.send('User is private');
  }
  if (user.numPosts < NUM_TO_CALC_AVERAGE_ENGAGEMENT) {
    return res.send(`User has ${user.numPosts} posts, which is fewer than the required ${NUM_TO_CALC_AVERAGE_ENGAGEMENT} posts`);
  }

  const posts = await downloadPosts(user.id, user.rhxGis, user.username);
  const { averageLikes, averageComments } = calcProfileStats(posts);

  // Update user in db
  user = {
    ...user,
    averageLikes,
    averageComments
  };

  const viralPosts = posts.filter(getViralContent(averageLikes));

  res.json({ ...user, viralPosts });

  await upsertUser(user, posts);
};
