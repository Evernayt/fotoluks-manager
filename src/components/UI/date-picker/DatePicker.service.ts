import moment from 'moment';

export const isWeekday = (date: Date) => {
  const day = moment(date).day();
  return day !== 0 && day !== 6;
};
