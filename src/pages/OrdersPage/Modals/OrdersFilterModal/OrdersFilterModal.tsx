import ShopAPI from 'api/ShopAPI/ShopAPI';
import {
  Button,
  Checkbox,
  DropdownButton,
  Modal,
  SelectButton,
  Textbox,
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
  const [shops, setShops] = useState<IShop[]>([]);

  const ordersFilterModal = useAppSelector(
    (state) => state.modal.ordersFilterModal
  );
  const employee = useAppSelector((state) => state.employee.employee);
  const startDate = useAppSelector((state) => state.order.startDate);
  const endDate = useAppSelector((state) => state.order.endDate);
  const selectedShop = useAppSelector((state) => state.order.selectedShop);
  const iOrderMember = useAppSelector((state) => state.order.iOrderMember);

  const dispatch = useAppDispatch();

  const periods = useMemo(
    () => [
      {
        id: 1,
        name: 'Текущий день',
        onClick: () => {
          const start = moment().startOf('day').format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setStartDate(start));

          const end = moment().endOf('day').format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setEndDate(end));
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
          dispatch(orderSlice.actions.setStartDate(start));

          const end = moment()
            .subtract(1, 'day')
            .endOf('day')
            .format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setEndDate(end));
        },
      },
      {
        id: 3,
        name: 'Текущая неделя',
        onClick: () => {
          const start = moment().startOf('week').format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setStartDate(start));

          const end = moment().endOf('week').format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setEndDate(end));
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
          dispatch(orderSlice.actions.setStartDate(start));

          const end = moment()
            .subtract(1, 'week')
            .endOf('week')
            .format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setEndDate(end));
        },
      },
      {
        id: 5,
        name: 'Текущий месяц',
        onClick: () => {
          const start = moment().startOf('month').format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setStartDate(start));

          const end = moment().endOf('month').format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setEndDate(end));
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
          dispatch(orderSlice.actions.setStartDate(start));

          const end = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(INPUT_DATE_FORMAT);
          dispatch(orderSlice.actions.setEndDate(end));
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (ordersFilterModal.isShowing) {
      fetchShops();
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
    dispatch(orderSlice.actions.setSelectedShop(ALL_SHOPS));
    dispatch(orderSlice.actions.setStartDate(''));
    dispatch(orderSlice.actions.setEndDate(''));
    dispatch(orderSlice.actions.setIOrderMember(false));
  };

  return (
    <Modal
      title="Фильтры заказов"
      isShowing={ordersFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <SelectButton
          title="Филиал"
          containerClassName={styles.shops_sb}
          items={shops}
          defaultSelectedItem={selectedShop}
          onChange={(item) =>
            dispatch(orderSlice.actions.setSelectedShop(item))
          }
        />

        <DropdownButton text="Период" options={periods} />

        <Textbox
          label="От"
          type="datetime-local"
          value={startDate}
          onChange={(e) =>
            dispatch(orderSlice.actions.setStartDate(e.target.value))
          }
        />
        <Textbox
          label="До"
          type="datetime-local"
          value={endDate}
          onChange={(e) =>
            dispatch(orderSlice.actions.setEndDate(e.target.value))
          }
        />
        <Checkbox
          text="Я участвую в заказе"
          checked={iOrderMember}
          onChange={() =>
            dispatch(orderSlice.actions.setIOrderMember(!iOrderMember))
          }
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
