import { extend } from 'umi-request';

const request = extend({
  prefix: 'http://localhost:3000',
  timeout: 60000,
  errorHandler: (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      window.location.href = '/user/login';
    }

    return Promise.reject(error);
  },
});

request.interceptors.request.use((url, options) => {
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return {
      url,
      options: { ...options, headers: headers },
    };
  }

  return {
    url,
    options: options,
  };
});

request.interceptors.response.use((response) => {
  return Promise.resolve(response);
});

export default request;
