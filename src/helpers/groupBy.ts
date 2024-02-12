const groupBy = <K, V>(
  arr: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K
): V[][] =>
  arr
    .reduce((acc, cur, idx, src) => {
      const key = getKey(cur, idx, src);
      const item = acc.find(([k]) => k === key);
      if (item) {
        const [, v] = item;
        v.push(cur);
      } else {
        acc.push([key, [cur]]);
      }
      return acc;
    }, [] as [K, V[]][])
    .map(([, v]) => v);

export default groupBy;
