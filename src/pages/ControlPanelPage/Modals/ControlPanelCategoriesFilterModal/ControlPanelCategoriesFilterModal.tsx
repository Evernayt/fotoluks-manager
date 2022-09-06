import { Button, Checkbox, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { initialFilter } from 'constants/InitialStates/initialFilterState';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelCategoriesFilterModal.module.css';

const ControlPanelCategoriesFilterModal = () => {
  const [inArchive, setInArchive] = useState<boolean>(false);

  const controlPanelCategoriesFilterModal = useAppSelector(
    (state) => state.modal.controlPanelCategoriesFilterModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelCategoriesFilterModal());
  };

  const clear = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(controlPanelSlice.actions.clearCategoriesFilter());

    reset();
    close();
  };

  const filter = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(
      controlPanelSlice.actions.activeCategoriesFilter({
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
      title="Фильтры категорий"
      isShowing={controlPanelCategoriesFilterModal.isShowing}
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

export default ControlPanelCategoriesFilterModal;
