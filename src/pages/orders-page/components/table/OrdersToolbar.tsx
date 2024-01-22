import { FC } from 'react';
import { Button, IconButton } from '@chakra-ui/react';
import { IconRefresh, IconTableExport } from '@tabler/icons-react';
import { FilterButton, Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { orderActions } from 'store/reducers/OrderSlice';

interface OrdersToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 заказов',
    value: 25,
  },
  {
    label: '50 заказов',
    value: 50,
  },
  {
    label: '100 заказов',
    value: 100,
  },
];

const OrdersToolbar: FC<OrdersToolbarProps> = ({ reload, onLimitChange }) => {
  const ordersFilter = useAppSelector((state) => state.filter.ordersFilter);
  const search = useAppSelector((state) => state.order.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(orderActions.setSearch(search));
  };

  const openOrdersExportModal = () => {
    dispatch(modalActions.openModal({ modal: 'ordersExportModal' }));
  };

  const openOrdersFilterModal = () => {
    dispatch(modalActions.openModal({ modal: 'ordersFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={() => reload()}
        >
          Обновить
        </Button>
        <Search
          placeholder="Поиск заказов"
          value={search}
          showResults={false}
          isRound={false}
          onChange={searchHandler}
        />
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <IconButton
          icon={<IconTableExport size={ICON_SIZE} stroke={ICON_STROKE} />}
          aria-label="export"
          onClick={openOrdersExportModal}
        />
        <FilterButton filter={ordersFilter} onClick={openOrdersFilterModal} />
        <Select
          options={limitOptions}
          defaultValue={limitOptions[0]}
          onChange={(option) => onLimitChange(option.value)}
        />
      </>
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default OrdersToolbar;
