const removeBeforeString = (fullStr: string, str: string): string => {
  const arr = fullStr.toLowerCase().split(str.toLowerCase());
  const beforeStrLength = arr[0].length;
  const strLength = str.length;

  if (beforeStrLength !== fullStr.length && str.length) {
    return fullStr.slice(beforeStrLength + strLength);
  } else {
    return fullStr;
  }
};

export default removeBeforeString;
