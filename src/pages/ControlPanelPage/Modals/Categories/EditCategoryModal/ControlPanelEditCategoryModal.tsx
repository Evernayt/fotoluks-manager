import CategoryAPI from 'api/CategoryAPI/CategoryAPI';
import { UpdateCategoryDto } from 'api/CategoryAPI/dto/update-category.dto';
import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ICategory } from 'models/api/ICategory';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditCategoryModal.module.scss';

const ControlPanelEditCategoryModal = () => {
  const [category, setCategory] = useState<ICategory>();
  const [name, setName] = useState<string>('');

  const editCategoryModal = useAppSelector(
    (state) => state.modal.controlPanelEditCategoryModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editCategoryModal.isShowing) {
      if (editCategoryModal.mode === Modes.EDIT_MODE) {
        fetchCategory();
      }
    }
  }, [editCategoryModal.isShowing]);

  const fetchCategory = () => {
    CategoryAPI.getOne(editCategoryModal.categoryId).then((data) => {
      setCategory(data);
      setName(data.name);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditCategoryModal'));

    setCategory(undefined);
    setName('');
  };

  const updateCategory = () => {
    if (category) {
      const updatedCategory: UpdateCategoryDto = { id: category.id, name };
      CategoryAPI.update(updatedCategory).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createCategory = () => {
    CategoryAPI.create({ name }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  return (
    <Modal
      title={
        editCategoryModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новая категория'
      }
      isShowing={editCategoryModal.isShowing}
      hide={close}
    >
      <div>
        <Textbox
          label="Наименование"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editCategoryModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              disabled={name === ''}
              onClick={createCategory}
            >
              Создать
            </Button>
          ) : (
            <Button
              variant={ButtonVariants.primary}
              disabled={name === ''}
              onClick={updateCategory}
            >
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditCategoryModal;
