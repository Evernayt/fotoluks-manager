import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelFeaturesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelFeaturesToolbar: FC<ControlPanelFeaturesToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const featuresFilter = useAppSelector(
    (state) => state.controlPanel.featuresFilter
  );

  const limitItems = useMemo<ISelectItem[]>(
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

  const dispatch = useAppDispatch();

  const openFeatureEditModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditFeatureModal',
        props: { featureId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const openFeaturesFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelFeaturesFilterModal' })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openFeatureEditModal}>Добавить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!featuresFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openFeaturesFilterModal}
            variant={
              featuresFilter.isActive
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

export default ControlPanelFeaturesToolbar;
