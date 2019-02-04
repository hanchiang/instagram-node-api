const axios = require('axios');

const { BASE_URL, COMMON_HEADERS } = require('../constants');

const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: COMMON_HEADERS
});

module.exports = Api;
