export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const removeAccessToken = () => {
  localStorage.removeItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const removeRefreshToken = () => {
  localStorage.removeItem('refresh_token');
};
