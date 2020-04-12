export let accessToken = "";

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = (token) => {
  return accessToken;
};
