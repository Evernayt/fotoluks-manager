import { useOnClickOutside } from 'hooks';
import { IOrder } from 'models/api/IOrder';
import { IStatus } from 'models/api/IStatus';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './StatusSelectButton.module.scss';

interface StatusSelectButtonProps {
  statuses: IStatus[];
  defaultSelectedStatus: IStatus;
  order: IOrder;
  onChange: (status: IStatus, order: IOrder) => void;
}

const StatusSelectButton: FC<StatusSelectButtonProps> = ({
  statuses,
  defaultSelectedStatus,
  order,
  onChange,
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<IStatus>(
    defaultSelectedStatus
  );

  const selectBtnRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectBtnRef, () => setIsHidden(true));

  useEffect(() => {
    setSelectedStatus(defaultSelectedStatus);
  }, [defaultSelectedStatus]);

  const statusChangeHandler = (status: IStatus) => {
    setIsHidden(true);
    setSelectedStatus(status);
    onChange(status, order);
  };

  return (
    <div className={styles.container} ref={selectBtnRef}>
      <div
        className={styles.status_select_btn}
        onClick={() => setIsHidden((prevState) => !prevState)}
      >
        <div
          className={styles.indicator}
          style={{
            backgroundColor: selectedStatus.color,
          }}
        />
        {selectedStatus.name}
      </div>
      <ul
        className={styles.menu}
        style={isHidden ? { display: 'none' } : { display: 'block' }}
      >
        {statuses.map((status: IStatus) => {
          return (
            <li key={status.id}>
              <input
                className={styles.input}
                id={status.name + status.id + order.id}
                name="status_select_btn"
                type="radio"
                checked={selectedStatus.id === status.id}
                onChange={() => statusChangeHandler(status)}
              />
              <label
                className={styles.item}
                htmlFor={status.name + status.id + order.id}
              >
                {status.name}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatusSelectButton;
