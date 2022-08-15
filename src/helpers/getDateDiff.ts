const getDateDiff = (date: string) => {
  const currentDate = new Date();

  let delta = Math.abs(Date.parse(date) - Number(currentDate)) / 1000;

  const years = Math.floor(delta / 31536000);
  delta -= years * 31536000;

  if (years > 0) {
    return years + ' г.';
  } else {
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    if (days > 0) {
      return days + ' д.';
    } else {
      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      if (hours > 0) {
        return hours + ' ч.';
      } else {
        const minutes = Math.floor(delta / 60) % 60;
        return minutes + ' мин.';
      }
    }
  }
};

export default getDateDiff;
