import {
  Button,
  IconButton,
  Modal,
  SelectButton,
  Textarea,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchCategoriesAPI } from 'http/categoryAPI';
import {
  createProductAPI,
  fetchProductAPI,
  updateProductAPI,
} from 'http/productAPI';
import { plusIcon } from 'icons';
import { ICategory } from 'models/ICategory';
import { IProduct } from 'models/IProduct';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditProductModal.module.css';

const ControlPanelEditProductModal = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(
    categories[0]
  );
  const [productId, setProductId] = useState<number>(0);
  const [productName, setProductName] = useState<string>('');
  const [productPluralName, setProductPluralName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productImage, setProductImage] = useState<string>('');

  const controlPanelEditProductModal = useAppSelector(
    (state) => state.modal.controlPanelEditProductModal
  );
  const controlPanelEditCategoryModal = useAppSelector(
    (state) => state.modal.controlPanelEditCategoryModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditProductModal.isShowing) {
      if (controlPanelEditProductModal.mode === Modes.EDIT_MODE) {
        fetchProduct();
      }

      fetchCategories();
    }
  }, [controlPanelEditProductModal.isShowing]);

  useEffect(() => {
    if (
      !controlPanelEditCategoryModal.isShowing &&
      controlPanelEditProductModal.isShowing
    ) {
      fetchCategories();
    }
  }, [controlPanelEditCategoryModal.isShowing]);

  const fetchCategories = () => {
    fetchCategoriesAPI().then((data) => {
      setCategories(data.rows);
    });
  };

  const fetchProduct = () => {
    fetchProductAPI(controlPanelEditProductModal.productId).then((data) => {
      if (data.category) setSelectedCategory(data.category);
      setProductId(data.id);
      setProductName(data.name);
      setProductPluralName(data.pluralName);
      setProductDescription(data.description);
      setProductImage(data.image);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditProductModal());

    setCategories([]);
    setSelectedCategory(categories[0]);
    setProductName('');
    setProductPluralName('');
    setProductDescription('');
    setProductImage('');
  };

  const updateProduct = () => {
    const updatedProduct: IProduct = {
      id: productId,
      name: productName,
      pluralName: productPluralName,
      description: productDescription,
      image: productImage,
      categoryId: selectedCategory.id,
    };
    updateProductAPI(updatedProduct).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const createProduct = () => {
    createProductAPI(
      productName,
      productPluralName,
      productDescription,
      productImage,
      selectedCategory.id
    ).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const openEditCategoryModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditCategoryModal({
        categoryId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  return (
    <Modal
      title={
        controlPanelEditProductModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый продукт'
      }
      isShowing={controlPanelEditProductModal.isShowing}
      hide={close}
    >
      <div>
        <div className={styles.columns}>
          <img
            className={styles.image}
            src={productImage === '' ? noImage : productImage}
          />
          <div>
            <div className={styles.main_controls}>
              <Tooltip label="Категория">
                <div style={{width: '100%'}}>
                  <SelectButton
                    items={categories}
                    defaultSelectedItem={selectedCategory}
                    changeHandler={(e) => setSelectedCategory(e)}
                    style={{ width: '100%' }}
                  />
                </div>
              </Tooltip>

              <Tooltip label="Добавить категорию">
                <div>
                  <IconButton icon={plusIcon} onClick={openEditCategoryModal} />
                </div>
              </Tooltip>
            </div>

            <Textbox
              label="Наименование"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Textbox
              label="Наименование (во мн. ч.)"
              value={productPluralName}
              onChange={(e) => setProductPluralName(e.target.value)}
              containerStyle={{ margin: '12px 0', minWidth: '310px' }}
            />
            <Textarea
              label="Описание"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
        </div>
        <Textbox
          label="Изображение (URL)"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          containerStyle={{ margin: '12px 0' }}
        />

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditProductModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              onClick={createProduct}
              disabled={selectedCategory === undefined}
            >
              Создать
            </Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={updateProduct}>
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditProductModal;
