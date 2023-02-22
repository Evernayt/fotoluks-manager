import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Button, Loader, Modal, Textarea, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useRef, useState } from 'react';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './EndingGoodsEditProductModal.module.scss';

const EndingGoodsEditProductModal = () => {
  const [article, setArticle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [minimumBalance, setMinimumBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const startMinimumBalance = useRef<number>(0);
  const variantParentId = useRef<string>('');

  const editProductModal = useAppSelector(
    (state) => state.modal.endingGoodsEditProductModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editProductModal.isShowing) {
      fetchProduct();
    }
  }, [editProductModal.isShowing]);

  const fetchProduct = () => {
    setIsLoading(true);

    if (editProductModal.type === 'product') {
      MoyskladAPI.getProduct(editProductModal.productId)
        .then((productData) => {
          setArticle(productData.article || '');
          setCode(productData.code || '');
          setDescription(productData.description || '');
          setMinimumBalance(productData.minimumBalance || 0);
        })
        .finally(() => setIsLoading(false));
    } else if (editProductModal.type === 'variant') {
      MoyskladAPI.getVariant(editProductModal.productId)
        .then((variantData) => {
          setCode(variantData.code || '');
          setDescription(variantData.description || '');
          setMinimumBalance(variantData.product.minimumBalance || 0);
          startMinimumBalance.current = variantData.product.minimumBalance || 0;
          variantParentId.current = variantData.product.id;
        })
        .finally(() => setIsLoading(false));
    }
  };

  const updateProduct = () => {
    setIsLoading(true);

    if (editProductModal.type === 'product') {
      MoyskladAPI.updateProduct({
        id: editProductModal.productId,
        article,
        code,
        description,
        minimumBalance,
      })
        .then(() => {
          dispatch(endingGoodsSlice.actions.setForceUpdateProduct(true));
          close();
        })
        .finally(() => setIsLoading(false));
    } else if (editProductModal.type === 'variant') {
      MoyskladAPI.updateVariant({
        id: editProductModal.productId,
        code,
        description,
      }).then(() => {
        if (startMinimumBalance.current !== minimumBalance) {
          MoyskladAPI.updateProduct({
            id: variantParentId.current,
            minimumBalance,
          })
            .then(() => {
              dispatch(endingGoodsSlice.actions.setForceUpdateProduct(true));
              close();
            })
            .finally(() => setIsLoading(false));
        } else {
          dispatch(endingGoodsSlice.actions.setForceUpdateProduct(true));
          close();
        }
      });
    }
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('endingGoodsEditProductModal'));

    setArticle('');
    setCode('');
    setDescription('');
  };

  return (
    <Modal
      title="Редактирование"
      isShowing={editProductModal.isShowing}
      hide={close}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.inputs}>
            {editProductModal.type === 'product' && (
              <Textbox
                label="Артикул"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
              />
            )}
            <Textbox
              label="Код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Textbox
              label="Неснижаемый остаток"
              value={minimumBalance}
              type="number"
              min={0}
              onChange={(e) => setMinimumBalance(Number(e.target.value))}
            />
            <Textarea
              label="Комментарий"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ maxHeight: '200px', maxWidth: '300px' }}
            />
          </div>
          <Button variant={ButtonVariants.primary} onClick={updateProduct}>
            Изменить
          </Button>
        </>
      )}
    </Modal>
  );
};

export default EndingGoodsEditProductModal;
