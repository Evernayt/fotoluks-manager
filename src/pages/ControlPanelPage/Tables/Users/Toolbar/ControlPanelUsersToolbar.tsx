import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface ControlPanelUsersToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const ControlPanelUsersToolbar: FC<ControlPanelUsersToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const usersFilter = useAppSelector((state) => state.controlPanel.usersFilter);

  const limitItems = useMemo<ISelectItem[]>(
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

  const dispatch = useAppDispatch();

  const openUsersFilterModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'controlPanelUsersFilterModal' })
    );
  };

  const openUserRegistrationModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditUserModal',
        props: { userId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openUserRegistrationModal}>Зарегистрировать</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!usersFilter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openUsersFilterModal}
            variant={
              usersFilter.isActive
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

export default ControlPanelUsersToolbar;
