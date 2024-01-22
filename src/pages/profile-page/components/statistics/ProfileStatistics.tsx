import OrderInfoAPI from 'api/OrderInfoAPI/OrderInfoAPI';
import { useAppSelector } from 'hooks/redux';
import { IOrderInfo, IStatistic } from 'models/api/IOrderInfo';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { CircleDiagram, Select } from 'components';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { ICircleDiagramData } from 'components/ui/circle-diagram/CircleDiagram';
import { toPercentages } from 'helpers';
import { FormControl, FormLabel } from '@chakra-ui/react';
import styles from './ProfileStatistics.module.scss';

const periods = [
  {
    id: 1,
    name: 'Текущий день',
    startDate: moment().startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  },
  {
    id: 2,
    name: 'Предыдущий день',
    startDate: moment().subtract(1, 'day').startOf('day').toISOString(),
    endDate: moment().subtract(1, 'day').endOf('day').toISOString(),
  },
  {
    id: 3,
    name: 'Текущую неделю',
    startDate: moment().startOf('week').toISOString(),
    endDate: moment().endOf('week').toISOString(),
  },
  {
    id: 4,
    name: 'Предыдущую неделю',
    startDate: moment().subtract(1, 'week').startOf('week').toISOString(),
    endDate: moment().subtract(1, 'week').endOf('week').toISOString(),
  },
  {
    id: 5,
    name: 'Текущий месяц',
    startDate: moment().startOf('month').toISOString(),
    endDate: moment().endOf('month').toISOString(),
  },
  {
    id: 6,
    name: 'Предыдущий месяц',
    startDate: moment().subtract(1, 'month').startOf('month').toISOString(),
    endDate: moment().subtract(1, 'month').endOf('month').toISOString(),
  },
];

const ProfileStatistics = () => {
  const [diagramData, setDiagramData] = useState<ICircleDiagramData[]>([]);
  const [orderInfos, setOrderInfos] = useState<IOrderInfo[]>([]);
  const [statistics, setStatistics] = useState<IStatistic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[4]);

  const employee = useAppSelector((state) => state.employee.employee);

  const includeOrderApp = employee?.apps?.find((app) => app.value === 'ORDERS');

  useEffect(() => {
    if (includeOrderApp) {
      fetchStatistics(periods[4].startDate, periods[4].endDate);
    }
  }, []);

  const fetchStatistics = (startDate: string, endDate: string) => {
    if (!employee) return;

    OrderInfoAPI.getStatistics({ employeeId: employee.id, startDate, endDate })
      .then((data) => {
        const counts: number[] = [];
        data.count.forEach((c) => {
          counts.push(c.count);
        });

        const tempDiagramData: ICircleDiagramData[] = [];
        const percentageCounts = toPercentages(counts);

        for (let i = 0; i < percentageCounts.length; i++) {
          tempDiagramData.push({
            id: data.rows[i].id,
            color: data.rows[i].status?.color,
            value: percentageCounts[i],
          });
        }
        setDiagramData(tempDiagramData);
        setOrderInfos(data.rows);
        setStatistics(data.count);
      })
      .catch()
      .finally(() => setIsLoading(false));
  };

  const periodChangeHandler = (period: (typeof periods)[0]) => {
    setSelectedPeriod(period);
    fetchStatistics(period.startDate, period.endDate);
  };

  return (
    <>
      {includeOrderApp && (
        <LoaderWrapper isLoading={isLoading}>
          <CircleDiagram data={diagramData} width={250} height={250} />
          <FormControl mt={4}>
            <FormLabel>Ваши заказы за:</FormLabel>
            <Select
              className={styles.periods_select}
              options={periods}
              value={selectedPeriod}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              onChange={periodChangeHandler}
            />
          </FormControl>
          <div className={styles.status_items}>
            {orderInfos.map((orderInfo, index) => (
              <div className={styles.status_item} key={orderInfo.id}>
                <div
                  className={styles.status_item_color}
                  style={{ backgroundColor: orderInfo.status?.color }}
                />
                {`${orderInfo.status?.name}: ${statistics[index].count}`}
              </div>
            ))}
          </div>
        </LoaderWrapper>
      )}
    </>
  );
};

export default ProfileStatistics;
