import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './OrdersToolbar.module.css';

interface OrdersToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const OrdersToolbar: FC<OrdersToolbarProps> = ({ reload, setLimit }) => {
  const ordersFilter = useAppSelector((state) => state.order.ordersFilter);

  const limits = useMemo<any>(
    () => [
      {
        id: 1,
        name: '15 заказов',
        value: 15,
      },
      {
        id: 2,
        name: '25 заказов',
        value: 25,
      },
      {
        id: 3,
        name: '50 заказов',
        value: 50,
      },
    ],
    []
  );

  const [selectedLimit, setSelectedLimit] = useState(limits[0]);

  const dispatch = useAppDispatch();

  const selectLimit = (e: any) => {
    setSelectedLimit(e);
    setLimit(e.value);
  };

  const openOrdersExportModal = () => {
    dispatch(modalSlice.actions.openOrdersExportModal());
  };

  const openOrdersFilterModal = () => {
    dispatch(modalSlice.actions.openOrdersFilterModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
      </div>
      <div className={styles.right_section}>
        <Button
          style={{ width: 'max-content' }}
          onClick={openOrdersExportModal}
        >
          Экспорт
        </Button>
        <Tooltip
          label="Фильтры включены"
          disabled={!ordersFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openOrdersFilterModal}
            variant={
              ordersFilter.filter.isActive
                ? ButtonVariants.primaryDeemphasized
                : ButtonVariants.default
            }
          >
            Фильтры
          </Button>
        </Tooltip>

        <SelectButton
          items={limits}
          defaultSelectedItem={selectedLimit}
          changeHandler={selectLimit}
          placement={Placements.bottomEnd}
        />
      </div>
    </div>
  );
};

export default OrdersToolbar;
