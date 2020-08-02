const _ = require('lodash');

const { logger } = require('../utils/logging');
const { User, Post, sequelize } = require('../db');

const UPDATE_USER_FIELDS = [
  'username', 'fullname', 'numPosts', 'numFollowers', 'numFollowing', 'averageLikes', 'averageComments',
  'isPrivate', 'isVerified', 'profilePicUrl', 'isBusinessAccount', 'businessCategoryName',
  'csrfToken', 'countryCode', 'languageCode', 'locale',
];

const CREATE_USER_FIELDS = [
  'id', ...UPDATE_USER_FIELDS
];

const upsertUser = async (user, posts) => {
  try {
    await sequelize.transaction(async () => {
      await _upsertUser(user);
      // await _upsertPosts(posts);
    });
  } catch (e) {
    logger.error(e);
  }
};

const _upsertUser = async (user) => {
  const u = await User.findByPk(user.id);

  if (u != null) {
    await u.update(_.pick(user, UPDATE_USER_FIELDS));
    logger.info(`_upsertUser: updated user id: ${user.id}, username: ${user.username}`);
  } else {
    await User.create(_.pick(user, CREATE_USER_FIELDS));
    logger.info(`_upsertUser: created user id: ${user.id}, username: ${user.username}`);
  }
};

// TODO:
// const _upsertPosts = async (posts) => {

// }

module.exports = {
  upsertUser
};
