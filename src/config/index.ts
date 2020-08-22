const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  dbName: process.env.DB_NAME || 'instagram',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST || 'localhost',
};

export default config;
