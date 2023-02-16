import ShopAPI from 'api/ShopAPI/ShopAPI';
import {
  Button,
  Checkbox,
  DropdownButton,
  Modal,
  SelectButton,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { INPUT_DATE_FORMAT } from 'constants/app';
import { ALL_SHOPS } from 'constants/states/shop-states';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrdersFilterModal.module.scss';

const OrdersFilterModal = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(ALL_SHOPS);
  const [iOrderMember, setIOrderMember] = useState<boolean>(false);

  const ordersFilterModal = useAppSelector(
    (state) => state.modal.ordersFilterModal
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const periods = useMemo(
    () => [
      {
        id: 1,
        name: 'Текущий день',
        onClick: () => {
          const start = moment().startOf('day').format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment().endOf('day').format(INPUT_DATE_FORMAT);
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
            .format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment()
            .subtract(1, 'day')
            .endOf('day')
            .format(INPUT_DATE_FORMAT);
          setEndDate(end);
        },
      },
      {
        id: 3,
        name: 'Текущая неделя',
        onClick: () => {
          const start = moment().startOf('week').format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment().endOf('week').format(INPUT_DATE_FORMAT);
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
            .format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment()
            .subtract(1, 'week')
            .endOf('week')
            .format(INPUT_DATE_FORMAT);
          setEndDate(end);
        },
      },
      {
        id: 5,
        name: 'Текущий месяц',
        onClick: () => {
          const start = moment().startOf('month').format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment().endOf('month').format(INPUT_DATE_FORMAT);
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
            .format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(INPUT_DATE_FORMAT);
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
          .format(INPUT_DATE_FORMAT);
        setStartDate(start);
      }

      if (endDate === '') {
        const end = moment().format(INPUT_DATE_FORMAT);
        setEndDate(end);
      }
    }
  }, [ordersFilterModal.isShowing]);

  const fetchShops = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setShops([ALL_SHOPS, ...data.rows]);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('ordersFilterModal'));
  };

  const clear = () => {
    dispatch(orderSlice.actions.setForceUpdate(true));
    dispatch(orderSlice.actions.clearOrdersFilter());

    reset();
    close();
  };

  const filter = () => {
    if (!employee) return;

    dispatch(orderSlice.actions.setForceUpdate(true));
    dispatch(
      orderSlice.actions.activeOrdersFilter({
        shopIds: [selectedShop.id],
        startDate,
        endDate,
        employeeId: iOrderMember ? employee.id : undefined,
      })
    );
    dispatch(orderSlice.actions.setSearch(''));
    close();
  };

  const reset = () => {
    setSelectedShop(ALL_SHOPS);

    const start = moment()
      .subtract(1, 'month')
      .startOf('month')
      .format(INPUT_DATE_FORMAT);
    setStartDate(start);

    const end = moment().format(INPUT_DATE_FORMAT);
    setEndDate(end);

    setIOrderMember(false);
  };

  return (
    <Modal
      title="Фильтры заказов"
      isShowing={ordersFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <Tooltip label="Филиал">
          <div>
            <SelectButton
              containerClassName={styles.shops_sb}
              items={shops}
              defaultSelectedItem={selectedShop}
              onChange={(item) => setSelectedShop(item)}
            />
          </div>
        </Tooltip>

        <DropdownButton text="Период" options={periods} />

        <Textbox
          label="От"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Textbox
          label="До"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Checkbox
          text="Я участвую в заказе"
          checked={iOrderMember}
          onChange={() => setIOrderMember((prevState) => !prevState)}
        />
      </div>
      <div className={styles.controls}>
        <Button onClick={clear}>Очистить</Button>
        <Button variant={ButtonVariants.primary} onClick={filter}>
          Готово
        </Button>
      </div>
    </Modal>
  );
};

export default OrdersFilterModal;
