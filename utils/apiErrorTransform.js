module.exports = (err) => {
  const { url } = err.config;
  const { message } = err;

  let error = new Error(`${message} at ${url}`);

  // Timeout
  if ((err.response && err.response.status === 408)
  || (err.code && err.code === 'ECONNABORTED')) {
    error = new Error(`${message} at ${url}`);
    error.status = 408;
    // throw error;
  } else if (err.response) {
    error.status = err.response.status;

    if (err.response.data.message === 'rate limited') {
      // err.response.data.message = 'rate limited'
      // err.response.data.status = 'fail'
      // err.response.status = 429
      // error = new Error(`${status}: ${err.response.data.message}, ${url}`);
      error.status = 429;
    }
    // throw error;
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    error = new Error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log('Error', err.message);
    error = new Error(err.message);
  }
  throw error;
};
