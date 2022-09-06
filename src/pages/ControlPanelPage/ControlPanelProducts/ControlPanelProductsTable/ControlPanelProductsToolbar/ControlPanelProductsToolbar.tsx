import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelProductsToolbar.module.css';

interface ControlPanelProductsToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelProductsToolbar: FC<ControlPanelProductsToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const productsFilter = useAppSelector(
    (state) => state.controlPanel.productsFilter
  );

  const limits = useMemo<any>(
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

  const [selectedLimit, setSelectedLimit] = useState(limits[0]);

  const dispatch = useAppDispatch();

  const selectLimit = (e: any) => {
    setSelectedLimit(e);
    setLimit(e.value);
  };

  const openProductEditModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditProductModal({
        productId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  const openProductsFilterModal = () => {
    dispatch(modalSlice.actions.openControlPanelProductsFilterModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
        <Button style={{ width: 'max-content' }} onClick={openProductEditModal}>
          Добавить
        </Button>
      </div>
      <div className={styles.right_section}>
        <Tooltip
          label="Фильтры включены"
          disabled={!productsFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openProductsFilterModal}
            variant={
              productsFilter.filter.isActive
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

export default ControlPanelProductsToolbar;
