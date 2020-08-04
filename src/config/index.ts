import { create } from 'apisauce';

import { BASE_URL, COMMON_HEADERS } from '../constants';

const Api = create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: COMMON_HEADERS,
});

export default Api;
