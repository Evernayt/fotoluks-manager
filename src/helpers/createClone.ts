const createClone = (item: [] | {}) => {
  return JSON.parse(JSON.stringify(item));
};

export default createClone;
