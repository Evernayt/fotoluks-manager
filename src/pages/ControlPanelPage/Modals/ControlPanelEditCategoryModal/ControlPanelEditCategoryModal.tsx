import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { createCategoryAPI } from 'http/categoryAPI';
import { useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditCategoryModal.module.css';

const ControlPanelEditCategoryModal = () => {
  const [categoryName, setCategoryName] = useState<string>('');

  const controlPanelEditCategoryModal = useAppSelector(
    (state) => state.modal.controlPanelEditCategoryModal
  );

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditCategoryModal());

    setCategoryName('');
  };

  const updateCategory = () => {
    dispatch(controlPanelSlice.actions.setForceUpdate(true));
    close();
  };

  const createCategory = () => {
    createCategoryAPI(categoryName).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  return (
    <Modal
      title={
        controlPanelEditCategoryModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новая категория'
      }
      isShowing={controlPanelEditCategoryModal.isShowing}
      hide={close}
    >
      <div>
        <Textbox
          label="Наименование"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditCategoryModal.mode === Modes.ADD_MODE ? (
            <Button variant={ButtonVariants.primary} onClick={createCategory}>
              Создать
            </Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={updateCategory}>
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditCategoryModal;
