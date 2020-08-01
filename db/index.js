/* eslint-disable prefer-destructuring */
const { Sequelize } = require('sequelize');

const { initUser, User } = require('./models/user');
const { initPost, Post } = require('./models/post');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql'
});

initUser(sequelize);
initPost(sequelize);

module.exports = {
  User, Post
}