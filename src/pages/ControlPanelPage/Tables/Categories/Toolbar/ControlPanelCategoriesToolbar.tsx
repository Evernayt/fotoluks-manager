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

const ControlPanelCategoriesToolbar: FC<ControlPanelProductsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const categoriesFilter = useAppSelector(
    (state) => state.controlPanel.categoriesFilter
  );

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '15 категорий',
        value: 15,
      },
      {
        id: 2,
        name: '25 категорий',
        value: 25,
      },
      {
        id: 3,
        name: '50 категорий',
        value: 50,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openCategoryEditModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditCategoryModal',
        props: { categoryId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const openCategoriesFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelCategoriesFilterModal',
      })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openCategoryEditModal}>Добавить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!categoriesFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openCategoriesFilterModal}
            variant={
              categoriesFilter.isActive
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

export default ControlPanelCategoriesToolbar;
