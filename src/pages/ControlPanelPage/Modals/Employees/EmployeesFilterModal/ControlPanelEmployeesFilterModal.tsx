import { Button, Checkbox, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEmployeesFilterModal.module.scss';

const ControlPanelEmployeesFilterModal = () => {
  const [archive, setArchive] = useState<boolean>(false);

  const employeeFilterModal = useAppSelector(
    (state) => state.modal.controlPanelEmployeeFilterModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEmployeeFilterModal'));
  };

  const clear = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(controlPanelSlice.actions.clearFilter('employeesFilter'));

    reset();
    close();
  };

  const filter = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(
      controlPanelSlice.actions.activeFilter({
        filter: 'employeesFilter',
        props: { archive },
      })
    );
    close();
  };

  const reset = () => {
    setArchive(false);
  };

  return (
    <Modal
      title="Фильтры сотрудников"
      isShowing={employeeFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <Checkbox
          text="В архиве"
          checked={archive}
          onChange={() => setArchive((prevState) => !prevState)}
        />
      </div>
      <div className={styles.controls}>
        <Button onClick={clear}>Очистить</Button>
        <Button variant={ButtonVariants.primary} onClick={filter}>
          Готово
        </Button>
      </div>
    </Modal>
  );
};

export default ControlPanelEmployeesFilterModal;
