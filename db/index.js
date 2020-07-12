/* eslint-disable prefer-destructuring */
const { Pool } = require('pg');

// default 10 sec
let idleTimeoutMillis = 10000;
if (process.argv.length === 3) {
  idleTimeoutMillis = process.argv[2];
}
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  idleTimeoutMillis
});

/**
 *
 * @param {object} config
 * @param {string} config.text
 * @param {Array<any>=} config.values
 * @param {string=} config.name
 * @param {string=} config.rowMode
 * @param {types=} config.types
 */
function query(config) {
  return pool.query(config).catch(err => { throw err; });
}

function getClient() {
  return pool.connect().catch(err => { throw err; });
}

module.exports = {
  query, getClient
};
