import { Button, FormLabel } from '@chakra-ui/react';
import moment from 'moment';
import { FC } from 'react';
import styles from './PeriodSelect.module.scss';

const periods = [
  {
    name: 'Вчера',
    shortName: 'вч',
    startDate: moment().subtract(1, 'day').startOf('day').toISOString(),
    endDate: moment().subtract(1, 'day').endOf('day').toISOString(),
  },
  {
    name: 'Сегодня',
    shortName: 'сег',
    startDate: moment().startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  },
  {
    name: 'Неделя',
    shortName: 'нед',
    startDate: moment().startOf('week').toISOString(),
    endDate: moment().endOf('week').toISOString(),
  },
  {
    name: 'Месяц',
    shortName: 'мес',
    startDate: moment().startOf('month').toISOString(),
    endDate: moment().endOf('month').toISOString(),
  },
];

interface PeriodSelectProps {
  label: string;
  onClick: (period: (typeof periods)[0]) => void;
}

const PeriodSelect: FC<PeriodSelectProps> = ({ label, onClick }) => {
  return (
    <div className={styles.container}>
      <FormLabel>{label}</FormLabel>
      <div className={styles.buttons}>
        {periods.map((period) => (
          <Button
            variant="link"
            fontWeight="500"
            minW="max-content"
            mr={2}
            onClick={() => onClick(period)}
            key={period.shortName}
          >
            {period.shortName}
          </Button>
        ))}
      </div>
    </div>
  );
};
//·
export default PeriodSelect;
