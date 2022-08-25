const toPercentages = (arr: number[]) => {
  let total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  
  return arr.map(function (x) {
    return parseFloat(((x * 100) / total).toFixed(2));
  });
};

export default toPercentages;
