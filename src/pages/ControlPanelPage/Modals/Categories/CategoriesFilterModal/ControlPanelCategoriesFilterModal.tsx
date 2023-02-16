import { Button, Checkbox, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelCategoriesFilterModal.module.scss';

const ControlPanelCategoriesFilterModal = () => {
  const [archive, setArchive] = useState<boolean>(false);

  const categoriesFilterModal = useAppSelector(
    (state) => state.modal.controlPanelCategoriesFilterModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(
      modalSlice.actions.closeModal('controlPanelCategoriesFilterModal')
    );
  };

  const clear = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(controlPanelSlice.actions.clearFilter('categoriesFilter'));

    reset();
    close();
  };

  const filter = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    dispatch(
      controlPanelSlice.actions.activeFilter({
        filter: 'categoriesFilter',
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
      title="Фильтры категорий"
      isShowing={categoriesFilterModal.isShowing}
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

export default ControlPanelCategoriesFilterModal;
