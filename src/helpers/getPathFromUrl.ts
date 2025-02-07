const getPathFromUrl = (url: string) => {
  return url.split(/[?#]/)[0];
};

export default getPathFromUrl;
