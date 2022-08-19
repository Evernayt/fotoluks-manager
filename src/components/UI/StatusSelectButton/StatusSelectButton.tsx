import { useOnClickOutside } from 'hooks';
import { IOrder } from 'models/IOrder';
import { IStatus } from 'models/IStatus';
import { FC, useRef, useState } from 'react';
import styles from './StatusSelectButton.module.css';

interface StatusSelectButtonProps {
  statuses: IStatus[];
  changeHandler: (status: IStatus, order: IOrder) => void;
  defaultSelectedStatus: IStatus;
  order: IOrder;
}

const StatusSelectButton: FC<StatusSelectButtonProps> = ({
  statuses,
  changeHandler,
  defaultSelectedStatus,
  order,
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<IStatus>(
    defaultSelectedStatus
  );

  const selectBtnRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectBtnRef, () => setIsHidden(true));

  const selectStatus = (status: IStatus) => {
    setIsHidden(true);
    setSelectedStatus(status);
    changeHandler(status, order);
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
            backgroundColor: `#${selectedStatus.color}`,
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
                onChange={() => selectStatus(status)}
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
