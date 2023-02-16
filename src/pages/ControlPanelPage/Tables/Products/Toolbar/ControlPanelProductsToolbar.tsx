import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelProductsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelProductsToolbar: FC<ControlPanelProductsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const productsFilter = useAppSelector(
    (state) => state.controlPanel.productsFilter
  );

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '15 продуктов',
        value: 15,
      },
      {
        id: 2,
        name: '25 продуктов',
        value: 25,
      },
      {
        id: 3,
        name: '50 продуктов',
        value: 50,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openProductEditModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditProductModal',
        props: { productId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const openProductsFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelProductsFilterModal' })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openProductEditModal}>Добавить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!productsFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openProductsFilterModal}
            variant={
              productsFilter.isActive
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

export default ControlPanelProductsToolbar;
