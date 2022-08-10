import {
  allOrdersCheckedIcon,
  allOrdersIcon,
  canceledOrdersCheckedIcon,
  canceledOrdersIcon,
  givenOrdersCheckedIcon,
  givenOrdersIcon,
  inWorkOrdersCheckedIcon,
  inWorkOrdersIcon,
  newOrderIcon,
  newOrdersCheckedIcon,
  newOrdersIcon,
  readyOrdersCheckedIcon,
  readyOrdersIcon,
  sidemenuCheckedIcon,
  sidemenuIcon,
} from 'icons';
import { useNavigate } from 'react-router-dom';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IStatus } from 'models/IStatus';
import { orderSlice } from 'store/reducers/OrderSlice';
import { Tooltip } from 'components';
import styles from './OrdersSidemenu.module.css';

const OrdersSidemenu = () => {
  const isMinimizedSidemenu = useAppSelector(
    (state) => state.order.isMinimizedSidemenu
  );
  const activeStatus = useAppSelector((state) => state.order.activeStatus);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setActiveStatus = (status: IStatus) => {
    dispatch(orderSlice.actions.setActiveStatus(status));
  };

  const toggleSidemenu = () => {
    dispatch(orderSlice.actions.setIsMinimizedSidemenu(!isMinimizedSidemenu));
  };

  const statuses = [
    {
      id: 0,
      checkedIcon: allOrdersCheckedIcon,
      icon: allOrdersIcon,
      name: 'Все заказы',
    },
    {
      id: 1,
      checkedIcon: newOrdersCheckedIcon,
      icon: newOrdersIcon,
      name: 'Новые',
    },
    {
      id: 2,
      checkedIcon: inWorkOrdersCheckedIcon,
      icon: inWorkOrdersIcon,
      name: 'В работе',
    },
    {
      id: 3,
      checkedIcon: readyOrdersCheckedIcon,
      icon: readyOrdersIcon,
      name: 'Готовые',
    },
    {
      id: 4,
      checkedIcon: givenOrdersCheckedIcon,
      icon: givenOrdersIcon,
      name: 'Отданные',
    },
    {
      id: 5,
      checkedIcon: canceledOrdersCheckedIcon,
      icon: canceledOrdersIcon,
      name: 'Отмененные',
    },
  ];

  return (
    <div
      className={styles.container}
      style={isMinimizedSidemenu ? { minWidth: '52px' } : { minWidth: '206px' }}
    >
      <div>
        <Tooltip
          label="Новый заказ"
          placement="right"
          delay={500}
          disabled={!isMinimizedSidemenu}
        >
          <div
            className={styles.btn}
            onClick={() => navigate(ORDER_DETAIL_ROUTE)}
          >
            <div className={styles.btn_icon}>
              <img src={newOrderIcon} alt="new-order" />
            </div>
            <span
              className={styles.text}
              style={
                isMinimizedSidemenu
                  ? { opacity: '0', visibility: 'hidden' }
                  : { opacity: '1', visibility: 'visible' }
              }
            >
              Новый заказ
            </span>
          </div>
        </Tooltip>

        <div className="separator" />

        {statuses.map((status) => (
          <Tooltip
            label={status.name}
            placement="right"
            delay={400}
            disabled={!isMinimizedSidemenu}
            key={status.id}
          >
            <div>
              <input
                id={status.id.toString()}
                name="orders-sidemenu"
                type="radio"
                checked={activeStatus?.id === status.id}
                onChange={() => setActiveStatus(status)}
              />
              <label className={styles.rbtn} htmlFor={status.id.toString()}>
                <div className={styles.rbtn_icon}>
                  <img
                    src={
                      activeStatus?.id === status.id
                        ? status.checkedIcon
                        : status.icon
                    }
                    alt={status.name}
                  />
                </div>
                <span
                  className={styles.text}
                  style={
                    isMinimizedSidemenu
                      ? { opacity: '0', visibility: 'hidden' }
                      : { opacity: '1', visibility: 'visible' }
                  }
                >
                  {status.name}
                </span>
              </label>
            </div>
          </Tooltip>
        ))}
      </div>
      <div>
        <input
          id="sidemenu_toggle"
          name="sidemenu_toggle"
          type="checkbox"
          onChange={toggleSidemenu}
        />
        <label className={styles.toggle} htmlFor="sidemenu_toggle">
          <img
            src={isMinimizedSidemenu ? sidemenuIcon : sidemenuCheckedIcon}
            alt="sidemenu"
          />
        </label>
      </div>
    </div>
  );
};

export default OrdersSidemenu;
