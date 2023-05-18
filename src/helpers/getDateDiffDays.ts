const getDateDiffDays = (date: string) => {
  const currentDate = new Date();

  let delta = Math.abs(Date.parse(date) - Number(currentDate)) / 1000;
  const days = Math.floor(delta / 86400);

  return days;
};

export default getDateDiffDays;
