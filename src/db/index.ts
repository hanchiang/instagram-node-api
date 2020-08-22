/* eslint-disable prefer-destructuring */
import { Sequelize } from 'sequelize';
import cls from 'cls-hooked';

import config from '../config';

const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);

import { initUser, User } from './models/user';
import { initPost, Post } from './models/post';
export { User, Post };

export const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,
    dialect: 'mysql',
  }
);

initUser(sequelize);
initPost(sequelize);
