const groupBy = (arr: any[], key: any): any[][] => {
  const groupedArr: any[][] = [];
  const reducedArr = arr.reduce((rv, x) => {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r: any) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({
        key: v,
        values: [x],
      });
    }

    return rv;
  }, []);

  for (let i = 0; i < reducedArr.length; i++) {
    groupedArr.push(reducedArr[i].values);
  }

  return groupedArr;
};

export default groupBy;
