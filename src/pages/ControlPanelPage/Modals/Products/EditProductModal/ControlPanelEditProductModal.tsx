import CategoryAPI from 'api/CategoryAPI/CategoryAPI';
import FileAPI from 'api/FileAPI/FileAPI';
import { CreateProductDto } from 'api/ProductAPI/dto/create-product.dto';
import { UpdateProductDto } from 'api/ProductAPI/dto/update-product.dto';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import {
  Button,
  EditableImage,
  IconButton,
  Modal,
  SelectButton,
  Textarea,
  Textbox,
  Tooltip,
} from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { INITIAL_CATEGORY } from 'constants/states/category-states';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconPlus } from 'icons';
import { ICategory } from 'models/api/ICategory';
import { IProduct } from 'models/api/IProduct';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditProductModal.module.scss';

const ControlPanelEditProductModal = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategory>(INITIAL_CATEGORY);
  const [name, setName] = useState<string>('');
  const [pluralName, setPluralName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [product, setProduct] = useState<IProduct>();

  const editProductModal = useAppSelector(
    (state) => state.modal.controlPanelEditProductModal
  );
  const controlPanelEditCategoryModal = useAppSelector(
    (state) => state.modal.controlPanelEditCategoryModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editProductModal.isShowing) {
      if (editProductModal.mode === Modes.EDIT_MODE) {
        fetchProduct();
      }

      fetchCategories();
    }
  }, [editProductModal.isShowing]);

  useEffect(() => {
    if (
      !controlPanelEditCategoryModal.isShowing &&
      editProductModal.isShowing
    ) {
      fetchCategories();
    }
  }, [controlPanelEditCategoryModal.isShowing]);

  const fetchCategories = () => {
    CategoryAPI.getAll().then((data) => {
      setCategories(data.rows);
    });
  };

  const fetchProduct = () => {
    ProductAPI.getOne(editProductModal.productId).then((data) => {
      if (data.category) setSelectedCategory(data.category);

      setProduct(data);
      setName(data.name);
      setPluralName(data.pluralName);
      setDescription(data.description);
      setImage(data.image);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditProductModal'));

    setCategories([]);
    setSelectedCategory(INITIAL_CATEGORY);
    setProduct(undefined);
    setName('');
    setPluralName('');
    setDescription('');
    setImage('');
  };

  const updateProduct = () => {
    const updatedProduct: UpdateProductDto = {
      id: product?.id,
      name,
      pluralName,
      description,
      image,
      categoryId: selectedCategory.id,
    };

    ProductAPI.update(updatedProduct).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const createProduct = () => {
    const createdProduct: CreateProductDto = {
      name,
      pluralName,
      description,
      image,
      categoryId: selectedCategory.id,
    };

    ProductAPI.create(createdProduct).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const openEditCategoryModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditCategoryModal',
        props: { categoryId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const editImage = (image: File) => {
    FileAPI.uploadFile(image, { isManagerFile: true }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (product) {
            const updatedProduct: UpdateProductDto = {
              id: product.id,
              image: data.link,
            };
            ProductAPI.update(updatedProduct).then(() => {
              setImage(data.link);
            });
          }
        });
      } else {
        res.json().then((data) => {
          showGlobalMessage(data.message);
        });
      }
    });
  };

  return (
    <Modal
      title={
        editProductModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый продукт'
      }
      isShowing={editProductModal.isShowing}
      hide={close}
    >
      <div>
        <div className={styles.columns}>
          {editProductModal.mode === Modes.EDIT_MODE && (
            <EditableImage
              className={styles.image}
              image={image ? image : noImage}
              size={148}
              onImageSelect={editImage}
            />
          )}
          <div className={styles.controls_container}>
            <div className={styles.main_controls}>
              <Tooltip label="Категория">
                <div style={{ width: '100%' }}>
                  <SelectButton
                    items={categories}
                    defaultSelectedItem={selectedCategory}
                    onChange={setSelectedCategory}
                    style={{ width: '100%' }}
                  />
                </div>
              </Tooltip>

              <Tooltip label="Добавить категорию">
                <div>
                  <IconButton
                    icon={<IconPlus className="secondary-icon" />}
                    onClick={openEditCategoryModal}
                  />
                </div>
              </Tooltip>
            </div>

            <Textbox
              label="Наименование"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textbox
              label="Наименование (во мн. ч.)"
              value={pluralName}
              onChange={(e) => setPluralName(e.target.value)}
            />
            <Textarea
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editProductModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              onClick={createProduct}
              disabled={selectedCategory.id === INITIAL_CATEGORY.id}
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
