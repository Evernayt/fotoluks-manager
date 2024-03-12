const isImageURL = (url: string): boolean => {
  return url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
};

export default isImageURL;
