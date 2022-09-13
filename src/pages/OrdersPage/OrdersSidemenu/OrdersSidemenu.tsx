import {
  IconAllOrders,
  IconCanceledOrders,
  IconGivenOrders,
  IconInWorkOrders,
  IconNewOrders,
  IconReadyOrders,
  IconSidemenuChecked,
  IconSidemenu,
  IconPlus,
} from 'icons';
import { useNavigate } from 'react-router-dom';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IStatus } from 'models/IStatus';
import { orderSlice } from 'store/reducers/OrderSlice';
import { Tooltip } from 'components';
import styles from './OrdersSidemenu.module.css';
import { useMemo } from 'react';
import { ISidemenu } from 'models/ISidemenu';

const OrdersSidemenu = () => {
  const isMinimizedSidemenu = useAppSelector(
    (state) => state.order.isMinimizedSidemenu
  );
  const activeStatus = useAppSelector((state) => state.order.activeStatus);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setActiveStatus = (sidemenuItem: ISidemenu) => {
    const status: IStatus = {
      id: sidemenuItem.id,
      name: sidemenuItem.name,
      color: '',
    };
    dispatch(orderSlice.actions.setActiveStatus(status));
  };

  const toggleSidemenu = () => {
    dispatch(orderSlice.actions.setIsMinimizedSidemenu(!isMinimizedSidemenu));
  };

  const statuses = useMemo<ISidemenu[]>(
    () => [
      {
        id: 0,
        Icon: IconAllOrders,
        name: 'Все заказы',
      },
      {
        id: 1,
        Icon: IconNewOrders,
        name: 'Новые',
      },
      {
        id: 2,
        Icon: IconInWorkOrders,
        name: 'В работе',
      },
      {
        id: 3,
        Icon: IconReadyOrders,
        name: 'Готовые',
      },
      {
        id: 4,
        Icon: IconGivenOrders,
        name: 'Отданные',
      },
      {
        id: 5,
        Icon: IconCanceledOrders,
        name: 'Отмененные',
      },
    ],
    []
  );

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
              <IconPlus className="primary-checked-icon" size={20} />
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

        {statuses.map((status) => {
          const { Icon } = status;
          return (
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
                    <Icon
                      className={
                        activeStatus?.id === status.id
                          ? 'secondary-checked-icon'
                          : 'secondary-icon'
                      }
                      size={20}
                    />
                  </div>
                  <div
                    className={styles.text}
                    style={
                      isMinimizedSidemenu
                        ? { opacity: '0', visibility: 'hidden' }
                        : { opacity: '1', visibility: 'visible' }
                    }
                  >
                    {status.name}
                  </div>
                </label>
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div>
        <input
          id="sidemenu_toggle"
          name="sidemenu_toggle"
          type="checkbox"
          onChange={toggleSidemenu}
        />
        <label className={styles.toggle} htmlFor="sidemenu_toggle">
          {isMinimizedSidemenu ? (
            <IconSidemenu className="link-icon" size={20} />
          ) : (
            <IconSidemenuChecked className="link-icon" size={20} />
          )}
        </label>
      </div>
    </div>
  );
};

export default OrdersSidemenu;
