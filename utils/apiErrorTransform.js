module.exports = (err) => {
  const { url } = err.config;
  const { message } = err;

  let error = new Error(`${message} at ${url}`);

  // Timeout
  if ((err.response && err.response.status === 408)
  || (err.code && err.code === 'ECONNABORTED')) {
    error.status = 408;
  } else if (err.response) {
    error.status = err.response.status;

    if (err.response.data.message === 'rate limited') {
      // err.response.data.message = 'rate limited'
      // err.response.data.status = 'fail'
      // err.response.status = 429
      // error = new Error(`${status}: ${err.response.data.message}, ${url}`);
      error.status = 429;
    }
  } else if (err.request) {
    error = new Error(err.request);
  } else {
    error = new Error(err.message);
  }
  return err;
};
