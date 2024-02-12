const getFileNameByURL = (url: string) => {
  return url.split('/').pop();
};

export default getFileNameByURL;
