import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelEmployeesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelEmployeesToolbar: FC<ControlPanelEmployeesToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const employeesFilter = useAppSelector(
    (state) => state.controlPanel.employeesFilter
  );
  const disableFilter = useAppSelector(
    (state) => state.controlPanel.disableFilter
  );

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '15 сотрудников',
        value: 15,
      },
      {
        id: 2,
        name: '25 сотрудников',
        value: 25,
      },
      {
        id: 3,
        name: '50 сотрудников',
        value: 50,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openEmployeesFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelEmployeeFilterModal' })
    );
  };

  const openEmployeeRegistrationModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditEmployeeModal',
        props: { employeeId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openEmployeeRegistrationModal}>
          Зарегистрировать
        </Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!employeesFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openEmployeesFilterModal}
            variant={
              employeesFilter.isActive
                ? ButtonVariants.primaryDeemphasized
                : ButtonVariants.default
            }
            disabled={disableFilter}
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

export default ControlPanelEmployeesToolbar;
