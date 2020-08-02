/* eslint-disable prefer-destructuring */
const { Sequelize } = require('sequelize');
const cls = require('cls-hooked');

const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);

const { initUser, User } = require('./models/user');
const { initPost, Post } = require('./models/post');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

initUser(sequelize);
initPost(sequelize);

module.exports = {
  User, Post, sequelize
};
