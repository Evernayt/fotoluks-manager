import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelTypesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelTypesToolbar: FC<ControlPanelTypesToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const typesFilter = useAppSelector((state) => state.controlPanel.typesFilter);

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '15 товаров',
        value: 15,
      },
      {
        id: 2,
        name: '25 товаров',
        value: 25,
      },
      {
        id: 3,
        name: '50 товаров',
        value: 50,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openTypesFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelTypesFilterModal' })
    );
  };

  const openTypesEditModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditTypeModal',
        props: { typeId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openTypesEditModal}>Добавить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!typesFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openTypesFilterModal}
            variant={
              typesFilter.isActive
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

export default ControlPanelTypesToolbar;
