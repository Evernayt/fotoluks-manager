import { Button, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelFeaturesToolbar.module.css';

interface ControlPanelFeaturesToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelFeaturesToolbar: FC<ControlPanelFeaturesToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const featuresFilter = useAppSelector(
    (state) => state.controlPanel.featuresFilter
  );

  const limits = useMemo<any>(
    () => [
      {
        id: 1,
        name: '15 характеристик',
        value: 15,
      },
      {
        id: 2,
        name: '25 характеристик',
        value: 25,
      },
      {
        id: 3,
        name: '50 характеристик',
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

  const openFeatureEditModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditFeatureModal({
        isShowing: true,
        featureId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  const openFeaturesFilterModal = () => {
    dispatch(modalSlice.actions.openControlPanelFeaturesFilterModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
        <Button style={{ width: 'max-content' }} onClick={openFeatureEditModal}>
          Добавить
        </Button>
      </div>
      <div className={styles.right_section}>
        <Tooltip
          label="Фильтры включены"
          disabled={!featuresFilter.filter.isActive}
        >
          <Button
            style={{ width: 'max-content' }}
            onClick={openFeaturesFilterModal}
            variant={
              featuresFilter.filter.isActive
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

export default ControlPanelFeaturesToolbar;
