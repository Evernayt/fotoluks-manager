import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelShopsToolbar.module.css';

interface ControlPanelShopsToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelShopsToolbar: FC<ControlPanelShopsToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const shopsFilter = useAppSelector((state) => state.controlPanel.shopsFilter);

  const limits = useMemo<any>(
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

  const [selectedLimit, setSelectedLimit] = useState(limits[0]);

  const dispatch = useAppDispatch();

  const selectLimit = (e: any) => {
    setSelectedLimit(e);
    setLimit(e.value);
  };

  const openShopEditModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditShopModal({
        isShowing: true,
        shopId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  const openShopsFilterModal = () => {
    dispatch(modalSlice.actions.openControlPanelShopsFilterModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
        <Button style={{ width: 'max-content' }} onClick={openShopEditModal}>
          Добавить
        </Button>
      </div>
      <div className={styles.right_section}>
        <Tooltip
          label="Фильтры включены"
          disabled={!shopsFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openShopsFilterModal}
            variant={
              shopsFilter.filter.isActive
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

export default ControlPanelShopsToolbar;
