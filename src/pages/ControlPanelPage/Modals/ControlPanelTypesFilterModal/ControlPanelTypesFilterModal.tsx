import { Button, Modal, SelectButton } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { initialRole } from 'constants/InitialStates/initialFilterState';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IRole, UserRoles } from 'models/IUser';
import { useMemo, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelTypesFilterModal.module.css';

const ControlPanelTypesFilterModal = () => {
  const roles = useMemo<IRole[]>(
    () => [
      initialRole,
      {
        id: 0,
        name: 'Админ',
        role: UserRoles.ADMIN,
      },
      {
        id: 1,
        name: 'Сотрудник',
        role: UserRoles.EMPLOYEE,
      },
      {
        id: 2,
        name: 'Клиент',
        role: UserRoles.USER,
      },
    ],
    []
  );

  const [selectedRole, setSelectedRole] = useState<IRole>(roles[0]);

  const controlPanelTypesFilterModal = useAppSelector(
    (state) => state.modal.controlPanelTypesFilterModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelTypesFilterModal());
  };

  const clear = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(controlPanelSlice.actions.clearUsersFilter());

    reset();
    close();
  };

  const filter = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(
      controlPanelSlice.actions.activeTypesFilter({
        role: selectedRole,
      })
    );
    close();
  };

  const reset = () => {
    setSelectedRole(roles[0]);
  };

  return (
    <Modal
      title="Фильтры товаров"
      isShowing={controlPanelTypesFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {/* <SelectButton
          items={roles}
          defaultSelectedItem={selectedRole}
          changeHandler={(e) => setSelectedRole(e)}
          style={{ width: '100%' }}
        /> */}
      </div>
      <div className={styles.controls}>
        {/* <Button
          style={{ marginRight: '8px', minWidth: 'max-content' }}
          onClick={clear}
        >
          Очистить
        </Button>
        <Button variant={ButtonVariants.primary} onClick={filter}>
          Готово
        </Button> */}
      </div>
    </Modal>
  );
};

export default ControlPanelTypesFilterModal;
