import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelParamsToolbar.module.css';

interface ControlPanelParamsToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelParamsToolbar: FC<ControlPanelParamsToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const paramsFilter = useAppSelector(
    (state) => state.controlPanel.paramsFilter
  );

  const limits = useMemo<any>(
    () => [
      {
        id: 1,
        name: '15 параметров',
        value: 15,
      },
      {
        id: 2,
        name: '25 параметров',
        value: 25,
      },
      {
        id: 3,
        name: '50 параметров',
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

  const openParamEditModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditParamModal({
        isShowing: true,
        paramId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  const openParamsFilterModal = () => {
    dispatch(modalSlice.actions.openControlPanelParamsFilterModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
        <Button style={{ width: 'max-content' }} onClick={openParamEditModal}>
          Добавить
        </Button>
      </div>
      <div className={styles.right_section}>
        <Tooltip
          label="Фильтры включены"
          disabled={!paramsFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openParamsFilterModal}
            variant={
              paramsFilter.filter.isActive
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

export default ControlPanelParamsToolbar;
