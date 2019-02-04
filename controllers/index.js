const {
  fetchProfile, retrieveUserWebInfo, downloadPosts, calcProfileStats, getViralContent
} = require('../lib/insta');

const { NUM_TO_CALC_AVERAGE_ENGAGEMENT } = require('../constants');
const db = require('../db');
const queries = require('../db/queries');
const { logger } = require('../utils/logging');

exports.getUserMedia = async (req, res) => {
  const { username } = req.params;

  const { data: profileRes } = await fetchProfile(username);

  let user = await retrieveUserWebInfo(profileRes);

  if (user.isPrivate) {
    res.send('User is private');
  }
  if (user.numPosts < NUM_TO_CALC_AVERAGE_ENGAGEMENT) {
    res.send(`User has ${user.numPosts} posts, which is fewer than the required ${NUM_TO_CALC_AVERAGE_ENGAGEMENT} posts`);
  }

  const posts = await downloadPosts(user.id, user.rhxGis, user.username);

  const { averageLikes, averageComments } = calcProfileStats(posts);

  // Update usery
  user = {
    ...user,
    averageLikes,
    averageComments
  };

  const viralPosts = posts.filter(getViralContent(averageLikes));

  res.json({ ...user, posts, viralPosts });

  const result = await db.query(queries.upsertUser([
    user.id, user.username, user.fullname, user.numPosts, user.numFollowers,
    user.numFollowing, user.averageLikes, user.averageComments, user.isPrivate,
    user.isVerified, user.profilePicUrl, user.isBusinessAccount,
    user.businessCategoryName, user.businessEmail, user.businessPhoneNumber,
    user.businessAddressJson, user.rhxGis, user.csrfToken, user.countryCode,
    user.languageCode, user.locale
  ]));
  logger.info(`Upserted ${result.rowCount} record(s)`);
};
