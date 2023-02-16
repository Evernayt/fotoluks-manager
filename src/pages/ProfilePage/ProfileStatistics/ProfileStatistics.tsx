import OrderInfoAPI from 'api/OrderInfoAPI/OrderInfoAPI';
import { CircleDiagram, Loader, SelectButton } from 'components';
import { ICircleDiagramData } from 'components/UI/CircleDiagram/CircleDiagram';
import { INPUT_DATE_FORMAT } from 'constants/app';
import { toPercentages } from 'helpers';
import { useAppSelector } from 'hooks/redux';
import { IOrderInfo, IStatistic } from 'models/api/IOrderInfo';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import styles from './ProfileStatistics.module.scss';

const ProfileStatistics = () => {
  const periods = useMemo(
    () => [
      {
        id: 1,
        name: 'Текущий день',
        startDate: moment().startOf('day').format(INPUT_DATE_FORMAT),
        endDate: moment().endOf('day').format(INPUT_DATE_FORMAT),
      },
      {
        id: 2,
        name: 'Предыдущий день',
        startDate: moment()
          .subtract(1, 'day')
          .startOf('day')
          .format(INPUT_DATE_FORMAT),
        endDate: moment()
          .subtract(1, 'day')
          .endOf('day')
          .format(INPUT_DATE_FORMAT),
      },
      {
        id: 3,
        name: 'Текущую неделю',
        startDate: moment().startOf('week').format(INPUT_DATE_FORMAT),
        endDate: moment().endOf('week').format(INPUT_DATE_FORMAT),
      },
      {
        id: 4,
        name: 'Предыдущую неделю',
        startDate: moment()
          .subtract(1, 'week')
          .startOf('week')
          .format(INPUT_DATE_FORMAT),
        endDate: moment()
          .subtract(1, 'week')
          .endOf('week')
          .format(INPUT_DATE_FORMAT),
      },
      {
        id: 5,
        name: 'Текущий месяц',
        startDate: moment().startOf('month').format(INPUT_DATE_FORMAT),
        endDate: moment().endOf('month').format(INPUT_DATE_FORMAT),
      },
      {
        id: 6,
        name: 'Предыдущий месяц',
        startDate: moment()
          .subtract(1, 'month')
          .startOf('month')
          .format(INPUT_DATE_FORMAT),
        endDate: moment()
          .subtract(1, 'month')
          .endOf('month')
          .format(INPUT_DATE_FORMAT),
      },
    ],
    []
  );

  const [diagramData, setDiagramData] = useState<ICircleDiagramData[]>([]);
  const [orderInfos, setOrderInfos] = useState<IOrderInfo[]>([]);
  const [statistics, setStatistics] = useState<IStatistic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[4]);

  const employee = useAppSelector((state) => state.employee.employee);

  useEffect(() => {
    fetchStatistics(periods[4].startDate, periods[4].endDate);
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
      .finally(() => setIsLoading(false));
  };

  const periodChangeHandler = (period: typeof periods[0]) => {
    setSelectedPeriod(period);
    fetchStatistics(period.startDate, period.endDate);
  };

  return (
    <div>
      <div className={styles.diagram_container}>
        {isLoading ? (
          <Loader width="250px" height="250px" />
        ) : (
          <>
            <CircleDiagram data={diagramData} width={250} height={250} />
            <div className={styles.status_items}>
              <div>Ваши заказы за:</div>
              <SelectButton
                items={periods}
                defaultSelectedItem={selectedPeriod}
                onChange={periodChangeHandler}
              />
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileStatistics;
