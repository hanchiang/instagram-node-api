import axios from 'axios';

import { BASE_URL, COMMON_HEADERS } from '../constants';

const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: COMMON_HEADERS,
});

export default Api;
