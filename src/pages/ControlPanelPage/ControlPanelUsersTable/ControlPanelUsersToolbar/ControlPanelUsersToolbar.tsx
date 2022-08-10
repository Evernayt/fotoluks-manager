import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelUsersToolbar.module.css';

interface ControlPanelUsersToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelUsersToolbar: FC<ControlPanelUsersToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const usersFilter = useAppSelector((state) => state.controlPanel.usersFilter);

  const limits = useMemo<any>(
    () => [
      {
        id: 1,
        name: '15 пользователей',
        value: 15,
      },
      {
        id: 2,
        name: '25 пользователей',
        value: 25,
      },
      {
        id: 3,
        name: '50 пользователей',
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

  const openUsersFilterModal = () => {
    dispatch(modalSlice.actions.openControlPanelUsersFilterModal());
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
          disabled={!usersFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openUsersFilterModal}
            variant={
              usersFilter.filter.isActive
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

export default ControlPanelUsersToolbar;
