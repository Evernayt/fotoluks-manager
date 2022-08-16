import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelTypesToolbar.module.css';

interface ControlPanelProductsToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelTypesToolbar: FC<ControlPanelProductsToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const typesFilter = useAppSelector((state) => state.controlPanel.typesFilter);

  const limits = useMemo<any>(
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

  const [selectedLimit, setSelectedLimit] = useState(limits[0]);

  const dispatch = useAppDispatch();

  const selectLimit = (e: any) => {
    setSelectedLimit(e);
    setLimit(e.value);
  };

  const openTypesFilterModal = () => {
    dispatch(modalSlice.actions.openControlPanelTypesFilterModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
      </div>
      <div className={styles.right_section}>
        <Tooltip
          label="Фильтры включены"
          disabled={!typesFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openTypesFilterModal}
            variant={
              typesFilter.filter.isActive
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

export default ControlPanelTypesToolbar;
