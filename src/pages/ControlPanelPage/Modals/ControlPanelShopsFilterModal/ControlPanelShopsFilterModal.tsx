import { Button, Checkbox, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { initialFilter } from 'constants/InitialStates/initialFilterState';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelShopsFilterModal.module.css';

const ControlPanelShopsFilterModal = () => {
  const [inArchive, setInArchive] = useState<boolean>(false);

  const controlPanelShopsFilterModal = useAppSelector(
    (state) => state.modal.controlPanelShopsFilterModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelShopsFilterModal());
  };

  const clear = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(controlPanelSlice.actions.clearShopsFilter());

    reset();
    close();
  };

  const filter = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(
      controlPanelSlice.actions.activeShopsFilter({
        filter: initialFilter,
        archive: inArchive,
      })
    );
    close();
  };

  const reset = () => {
    setInArchive(false);
  };

  return (
    <Modal
      title="Фильтры филиалов"
      isShowing={controlPanelShopsFilterModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
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

export default ControlPanelShopsFilterModal;
