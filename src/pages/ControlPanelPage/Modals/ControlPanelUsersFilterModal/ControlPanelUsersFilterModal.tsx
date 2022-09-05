import { Button, Checkbox, Modal, SelectButton } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { initialRole } from 'constants/InitialStates/initialFilterState';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { IRole, UserRoles } from 'models/IUser';
import { useEffect, useMemo, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelUsersFilterModal.module.css';

const ControlPanelUsersFilterModal = () => {
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

  const allShops: IShop = {
    id: -1,
    name: 'Все филиалы',
    address: '',
    description: '',
  };

  const [selectedRole, setSelectedRole] = useState<IRole>(roles[0]);
  const [shops, setShops] = useState<IShop[]>([allShops]);
  const [selectedShop, setSelectedShop] = useState<IShop>(allShops);
  const [inArchive, setInArchive] = useState<boolean>(false);

  const controlPanelUsersFilterModal = useAppSelector(
    (state) => state.modal.controlPanelUsersFilterModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelUsersFilterModal.isShowing) {
      fetchShops();
    }
  }, [controlPanelUsersFilterModal.isShowing]);

  const fetchShops = () => {
    fetchShopsAPI(true).then((data) => {
      setShops([allShops, ...data]);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelUsersFilterModal());
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
      controlPanelSlice.actions.activeUsersFilter({
        role: selectedRole,
        shopId: selectedShop.id,
        archive: inArchive ? 1 : 0,
      })
    );
    close();
  };

  const reset = () => {
    setSelectedRole(roles[0]);
    setSelectedShop(allShops);
    setInArchive(false);
  };

  return (
    <Modal
      title="Фильтры пользователей"
      isShowing={controlPanelUsersFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <SelectButton
          items={roles}
          defaultSelectedItem={selectedRole}
          changeHandler={(e) => setSelectedRole(e)}
          style={{ width: '100%', marginBottom: '12px' }}
        />
        <SelectButton
          items={shops}
          defaultSelectedItem={selectedShop}
          changeHandler={(e) => setSelectedShop(e)}
          style={{ width: '100%', marginBottom: '12px' }}
        />
        <Checkbox
          text="В архиве"
          checked={inArchive}
          onChange={() => setInArchive((prevState) => !prevState)}
        />
      </div>
      <div className={styles.controls}>
        <Button
          style={{ marginRight: '8px', minWidth: 'max-content' }}
          onClick={clear}
        >
          Очистить
        </Button>
        <Button variant={ButtonVariants.primary} onClick={filter}>
          Готово
        </Button>
      </div>
    </Modal>
  );
};

export default ControlPanelUsersFilterModal;
