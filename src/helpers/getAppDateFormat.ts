import dateFormat from 'dateformat';

const getAppDateFormat = (date: string | number): string => {
  return `${dateFormat(date, 'yyyy-mm-dd')}T${dateFormat(date, 'HH:MM')}`;
};

export default getAppDateFormat;
