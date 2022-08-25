import { CircleDiagram, Loader, SelectButton } from 'components';
import { ICircleDiagramData } from 'components/UI/CircleDiagram/CircleDiagram';
import { INPUT_FORMAT } from 'constants/app';
import { toPercentages } from 'helpers';
import { useAppSelector } from 'hooks/redux';
import { fetchStatusOrdersAPI } from 'http/statusAPI';
import { IStatus } from 'models/IStatus';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import styles from './ProfileStatistics.module.css';

const ProfileStatistics = () => {
  const periods = useMemo(
    () => [
      {
        id: 1,
        name: 'Текущий день',
        onClick: () => {
          const start = moment().startOf('day').format(INPUT_FORMAT);
          const end = moment().endOf('day').format(INPUT_FORMAT);
          fetchStatusOrders(start, end);
        },
      },
      {
        id: 2,
        name: 'Предыдущий день',
        onClick: () => {
          const start = moment()
            .subtract(1, 'day')
            .startOf('day')
            .format(INPUT_FORMAT);
          const end = moment()
            .subtract(1, 'day')
            .endOf('day')
            .format(INPUT_FORMAT);
          fetchStatusOrders(start, end);
        },
      },
      {
        id: 3,
        name: 'Текущую неделю',
        onClick: () => {
          const start = moment().startOf('week').format(INPUT_FORMAT);
          const end = moment().endOf('week').format(INPUT_FORMAT);
          fetchStatusOrders(start, end);
        },
      },
      {
        id: 4,
        name: 'Предыдущую неделю',
        onClick: () => {
          const start = moment()
            .subtract(1, 'week')
            .startOf('week')
            .format(INPUT_FORMAT);
          const end = moment()
            .subtract(1, 'week')
            .endOf('week')
            .format(INPUT_FORMAT);
          fetchStatusOrders(start, end);
        },
      },
      {
        id: 5,
        name: 'Текущий месяц',
        onClick: () => {
          const start = moment().startOf('month').format(INPUT_FORMAT);
          const end = moment().endOf('month').format(INPUT_FORMAT);
          fetchStatusOrders(start, end);
        },
      },
      {
        id: 6,
        name: 'Предыдущий месяц',
        onClick: () => {
          const start = moment()
            .subtract(1, 'month')
            .startOf('month')
            .format(INPUT_FORMAT);
          const end = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(INPUT_FORMAT);
          fetchStatusOrders(start, end);
        },
      },
    ],
    []
  );

  const [diagramData, setDiagramData] = useState<ICircleDiagramData[]>([]);
  const [statusOrders, setStatusOrders] = useState<IStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[4]);

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const start = moment().startOf('month').format(INPUT_FORMAT);
    const end = moment().endOf('month').format(INPUT_FORMAT);
    fetchStatusOrders(start, end);
  }, []);

  const fetchStatusOrders = (startDate: string, endDate: string) => {
    if (user) {
      setIsLoading(true);
      fetchStatusOrdersAPI(user.id, startDate, endDate)
        .then((data) => {
          const tempDiagramData: ICircleDiagramData[] = [];
          const values: number[] = [];
          for (let i = 0; i < data.length; i++) {
            values.push(data[i].ordersCount!);
          }

          const percentageValues = toPercentages(values);

          for (let j = 0; j < percentageValues.length; j++) {
            tempDiagramData.push({
              id: data[j].id,
              color: data[j].color,
              value: percentageValues[j],
            });
          }

          setDiagramData(tempDiagramData);
          setStatusOrders(data);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const selectPeriod = (changeHandler: () => void, index: number) => {
    changeHandler();
    setSelectedPeriod(periods[index]);
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
              <div>Колличество измененных статусов за:</div>
              <SelectButton
                items={periods}
                defaultSelectedItem={selectedPeriod}
                changeHandler={(item, index) =>
                  selectPeriod(item.onClick, index)
                }
              />
              {statusOrders.map((statusOrder) => (
                <div className={styles.status_item} key={statusOrder.id}>
                  <div
                    className={styles.status_item_color}
                    style={{ backgroundColor: statusOrder.color }}
                  />
                  {`${statusOrder.name}: ${statusOrder.ordersCount}`}
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
