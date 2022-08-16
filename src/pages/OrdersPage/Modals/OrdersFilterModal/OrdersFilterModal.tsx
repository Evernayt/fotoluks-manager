import {
  Button,
  DropdownButton,
  Modal,
  SelectButton,
  Textbox,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { INPUT_FORMAT } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrdersFilterModal.module.css';

const OrdersFilterModal = () => {
  const activeShop = useAppSelector((state) => state.app.activeShop);

  const allShops: IShop = {
    id: -1,
    name: 'Все филиалы',
    address: '',
    description: '',
  };

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(activeShop);

  const ordersFilterModal = useAppSelector(
    (state) => state.modal.ordersFilterModal
  );

  const dispatch = useAppDispatch();

  const periods = useMemo(
    () => [
      {
        id: 1,
        name: 'Текущий день',
        onClick: () => {
          const start = moment().startOf('day').format(INPUT_FORMAT);
          setStartDate(start);

          const end = moment().endOf('day').format(INPUT_FORMAT);
          setEndDate(end);
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
          setStartDate(start);

          const end = moment()
            .subtract(1, 'day')
            .endOf('day')
            .format(INPUT_FORMAT);
          setEndDate(end);
        },
      },
      {
        id: 3,
        name: 'Текущая неделя',
        onClick: () => {
          const start = moment().startOf('week').format(INPUT_FORMAT);
          setStartDate(start);

          const end = moment().endOf('week').format(INPUT_FORMAT);
          setEndDate(end);
        },
      },
      {
        id: 4,
        name: 'Предыдущая неделя',
        onClick: () => {
          const start = moment()
            .subtract(1, 'week')
            .startOf('week')
            .format(INPUT_FORMAT);
          setStartDate(start);

          const end = moment()
            .subtract(1, 'week')
            .endOf('week')
            .format(INPUT_FORMAT);
          setEndDate(end);
        },
      },
      {
        id: 5,
        name: 'Текущий месяц',
        onClick: () => {
          const start = moment().startOf('month').format(INPUT_FORMAT);
          setStartDate(start);

          const end = moment().endOf('month').format(INPUT_FORMAT);
          setEndDate(end);
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
          setStartDate(start);

          const end = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(INPUT_FORMAT);
          setEndDate(end);
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (ordersFilterModal.isShowing) {
      fetchShops();

      if (startDate === '') {
        const start = moment()
          .subtract(1, 'month')
          .startOf('month')
          .format(INPUT_FORMAT);
        setStartDate(start);
      }

      if (endDate === '') {
        const end = moment().format(INPUT_FORMAT);
        setEndDate(end);
      }
    }
  }, [ordersFilterModal.isShowing]);

  const fetchShops = () => {
    fetchShopsAPI(true).then((data) => {
      setShops([allShops, ...data]);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeOrdersFilterModal());
  };

  const clear = () => {
    dispatch(orderSlice.actions.setForceUpdate(true));
    dispatch(orderSlice.actions.clearOrdersFilter());

    reset();
    close();
  };

  const filter = () => {
    dispatch(orderSlice.actions.setForceUpdate(true));
    dispatch(
      orderSlice.actions.activeOrdersFilter({
        shop: selectedShop,
        startDate,
        endDate,
      })
    );
    close();
  };

  const reset = () => {
    setSelectedShop(activeShop);

    const start = moment()
      .subtract(1, 'month')
      .startOf('month')
      .format(INPUT_FORMAT);
    setStartDate(start);

    const end = moment().format(INPUT_FORMAT);
    setEndDate(end);
  };

  return (
    <Modal
      title="Фильтры заказов"
      isShowing={ordersFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <SelectButton
          items={shops}
          defaultSelectedItem={selectedShop}
          changeHandler={(e) => setSelectedShop(e)}
          style={{ width: '100%', marginBottom: '12px' }}
        />

        <DropdownButton
          text="Период"
          options={periods}
          placement={Placements.bottomStart}
        />

        <Textbox
          label="От"
          type="datetime-local"
          containerStyle={{ margin: '24px 0 12px 0' }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Textbox
          label="До"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className={styles.controls}>
        <Button
          style={{ marginRight: '8px', minWidth: 'max-content' }}
          onClick={clear}
        >
          Очистить
        </Button>
        <Button
          variant={ButtonVariants.primary}
          onClick={filter}
          disabled={selectedShop.id === 0}
        >
          Готово
        </Button>
      </div>
    </Modal>
  );
};

export default OrdersFilterModal;
