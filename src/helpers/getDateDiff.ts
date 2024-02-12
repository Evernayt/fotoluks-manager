const getDateDiff = (date: string) => {
  const currentDate = new Date();

  const generalDelta = Math.abs(Date.parse(date) - Number(currentDate)) / 1000;
  let delta = generalDelta;

  const years = Math.floor(delta / 31536000);
  delta -= years * 31536000;

  if (years > 0) {
    return { diff: years + ' г.', delta: generalDelta };
  } else {
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    if (days > 0) {
      return { diff: days + ' д.', delta: generalDelta };
    } else {
      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      if (hours > 0) {
        return { diff: hours + ' ч.', delta: generalDelta };
      } else {
        const minutes = Math.floor(delta / 60) % 60;
        return { diff: minutes + ' мин.', delta: generalDelta };
      }
    }
  }
};

export default getDateDiff;
