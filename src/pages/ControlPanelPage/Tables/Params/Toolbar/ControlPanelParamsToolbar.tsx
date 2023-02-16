import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelParamsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelParamsToolbar: FC<ControlPanelParamsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const paramsFilter = useAppSelector(
    (state) => state.controlPanel.paramsFilter
  );

  const limitItems = useMemo<ISelectItem[]>(
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

  const dispatch = useAppDispatch();

  const openParamEditModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditParamModal',
        props: { paramId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const openParamsFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelParamsFilterModal' })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openParamEditModal}>Добавить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!paramsFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openParamsFilterModal}
            variant={
              paramsFilter.isActive
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

export default ControlPanelParamsToolbar;
