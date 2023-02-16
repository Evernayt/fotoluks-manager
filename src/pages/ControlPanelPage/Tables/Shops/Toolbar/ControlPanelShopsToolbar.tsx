import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelShopsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelShopsToolbar: FC<ControlPanelShopsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const shopsFilter = useAppSelector((state) => state.controlPanel.shopsFilter);

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '15 филиалов',
        value: 15,
      },
      {
        id: 2,
        name: '25 филиалов',
        value: 25,
      },
      {
        id: 3,
        name: '50 филиалов',
        value: 50,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openShopEditModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditShopModal',
        props: { shopId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const openShopsFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelShopsFilterModal' })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openShopEditModal}>Добавить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!shopsFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openShopsFilterModal}
            variant={
              shopsFilter.isActive
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

export default ControlPanelShopsToolbar;
