import fs from 'fs';

if (fs.existsSync('.env')) {
  require('dotenv').config({ path: '.env' });
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  dbName: process.env.DB_NAME || 'instagram',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST || 'localhost',
  instagramUser: process.env.INSTAGRAM_USER,
  instagramPassword: process.env.INSTAGRAM_PASSWORD,
};

export default config;
