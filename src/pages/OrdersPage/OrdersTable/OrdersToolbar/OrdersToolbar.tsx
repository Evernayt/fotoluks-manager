import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface OrdersToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const OrdersToolbar: FC<OrdersToolbarProps> = ({ reload, onLimitChange }) => {
  const ordersFilter = useAppSelector((state) => state.order.ordersFilter);

  const limitItems = useMemo<ISelectItem[]>(
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

  const dispatch = useAppDispatch();

  const openOrdersExportModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'ordersExportModal' }));
  };

  const openOrdersFilterModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'ordersFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Button onClick={openOrdersExportModal}>Экспорт</Button>
        <Tooltip label="Фильтры включены" disabled={!ordersFilter.isActive}>
          <Button
            onClick={openOrdersFilterModal}
            variant={
              ordersFilter.isActive
                ? ButtonVariants.primaryDeemphasized
                : ButtonVariants.default
            }
          >
            Фильтры
          </Button>
        </Tooltip>

        <SelectButton
          items={limitItems}
          defaultSelectedItem={limitItems[0]}
          onChange={(item) => onLimitChange(item.value)}
          placement={Placements.bottomEnd}
        />
      </>
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default OrdersToolbar;
