import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  createCategoryAPI,
  fetchCategoryAPI,
  updateCategoryAPI,
} from 'http/categoryAPI';
import { ICategory } from 'models/ICategory';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditCategoryModal.module.css';

const ControlPanelEditCategoryModal = () => {
  const [category, setCategory] = useState<ICategory>();
  const [categoryName, setCategoryName] = useState<string>('');

  const controlPanelEditCategoryModal = useAppSelector(
    (state) => state.modal.controlPanelEditCategoryModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditCategoryModal.isShowing) {
      if (controlPanelEditCategoryModal.mode === Modes.EDIT_MODE) {
        fetchCategory();
      }
    }
  }, [controlPanelEditCategoryModal.isShowing]);

  const fetchCategory = () => {
    fetchCategoryAPI(controlPanelEditCategoryModal.categoryId).then((data) => {
      setCategory(data);
      setCategoryName(data.name);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditCategoryModal());

    setCategory(undefined);
    setCategoryName('');
  };

  const updateCategory = () => {
    if (category) {
      updateCategoryAPI(category?.id, categoryName).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
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
