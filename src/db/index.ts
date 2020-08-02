/* eslint-disable prefer-destructuring */
import { Sequelize } from 'sequelize';
import cls from 'cls-hooked';

const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);

import { initUser, User } from './models/user';
import { initPost, Post } from './models/post';
export { User, Post };

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

initUser(sequelize);
initPost(sequelize);
