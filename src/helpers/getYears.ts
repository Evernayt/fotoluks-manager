const getYears = (stopYear: number, startYear: number): number[] => {
  const step = -1;

  const arr = Array.from(
    { length: (stopYear - startYear) / step + 1 },
    (_, i) => startYear + i * step
  );
  return arr;
};

export default getYears;
