import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Button, CopiedItem, Loader, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { NOT_INDICATED } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IBarcode } from 'models/api/moysklad/IBarcode';
import { IStore } from 'models/api/moysklad/IStore';
import { useEffect, useState } from 'react';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import EndingGoodsProductItem from './EndingGoodsProductItem/EndingGoodsProductItem';
import styles from './EndingGoodsProductModal.module.scss';

const EndingGoodsProductModal = () => {
  const [name, setName] = useState<string>('');
  const [codes, setCodes] = useState<string[]>([]);
  const [articles, setArticles] = useState<string[]>([]);
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [minimumBalance, setMinimumBalance] = useState<number>(0);
  const [supplier, setSupplier] = useState<string>('');
  const [description, setDescription] = useState<string | undefined>();
  const [type, setType] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [barcodes, setBarcodes] = useState<IBarcode[]>([]);
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const productModal = useAppSelector(
    (state) => state.modal.endingGoodsProductModal
  );
  const forceUpdateProduct = useAppSelector(
    (state) => state.endingGoods.forceUpdateProduct
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (productModal.isShowing) {
      fetchProduct();
    }
  }, [productModal.isShowing]);

  useEffect(() => {
    if (forceUpdateProduct) {
      fetchProduct();
      dispatch(endingGoodsSlice.actions.setForceUpdateProduct(false));
    }
  }, [forceUpdateProduct]);

  const fetchProduct = () => {
    if (!productModal.notification) return;
    setIsLoading(true);

    MoyskladAPI.getProduct(productModal.notification.good.id).then(
      (productData) => {
        const code = productData.code || NOT_INDICATED;
        const barcodes = productData.barcodes || [];
        const article = productData.article || NOT_INDICATED;
        const buyPrice = productData.buyPrice.value / 100;
        const minimumBalance = productData.minimumBalance || 0;
        const supplier = productData.supplier?.name || NOT_INDICATED;

        setArticles(article.split(','));
        setBuyPrice(buyPrice);
        setMinimumBalance(minimumBalance);
        setSupplier(supplier);

        if (productData.variantsCount) {
          MoyskladAPI.getAssortment({
            search: productModal.notification?.good.name,
          }).then((assortmentData) => {
            const variant = assortmentData.rows[0];
            const code = variant.code || NOT_INDICATED;
            const barcodes = variant.barcodes || [];
            setName(variant.name);
            setType(variant.meta.type);
            setProductId(variant.id);
            setDescription(variant.description);
            setCodes(code.split(','));
            setBarcodes(barcodes);

            MoyskladAPI.getStocks({
              type: variant.meta.type,
              productHref: variant.meta.href,
            })
              .then((stockData) => {
                setStores(stockData.rows[0].stockByStore);
              })
              .finally(() => setIsLoading(false));
          });
        } else {
          setName(productData.name);
          setType(productData.meta.type);
          setProductId(productData.id);
          setDescription(productData.description);
          setCodes(code.split(','));
          setBarcodes(barcodes);

          MoyskladAPI.getStocks({
            type: productData.meta.type,
            productHref: productData.meta.href,
          })
            .then((stockData) => {
              setStores(stockData.rows[0].stockByStore);
            })
            .finally(() => setIsLoading(false));
        }
      }
    );
  };

  const toggleOrdered = () => {
    if (!productModal.notification) return;
    const { good, ordered } = productModal.notification;

    dispatch(endingGoodsSlice.actions.toggleOrderedByGoodId(good.id));

    if (ordered) {
      dispatch(endingGoodsSlice.actions.removeOrderedGood(good.id));
    } else {
      dispatch(endingGoodsSlice.actions.addOrderedGood(good.id));
    }
    close();
  };

  const toggleNotAvailable = () => {
    if (!productModal.notification) return;
    const { good, notAvailable } = productModal.notification;

    dispatch(endingGoodsSlice.actions.toggleNotAvailableByGoodId(good.id));

    if (notAvailable) {
      dispatch(endingGoodsSlice.actions.removeNotAvailableGood(good.id));
    } else {
      dispatch(endingGoodsSlice.actions.addNotAvailableGood(good.id));
    }
    close();
  };

  const openEditProductModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'endingGoodsEditProductModal',
        props: { productId, type },
      })
    );
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('endingGoodsProductModal'));
    setName('');
    setType('');
    setProductId('');
    setCodes([]);
    setBarcodes([]);
    setArticles([]);
    setBuyPrice(0);
    setMinimumBalance(0);
    setSupplier('');
    setDescription(undefined);
    setIsLoading(true);
  };

  return (
    <Modal
      title={name}
      isShowing={productModal.isShowing}
      hide={close}
      separator={false}
    >
      <div className={styles.container}>
        {isLoading ? (
          <Loader height="calc(100% - 60px)" />
        ) : (
          <>
            <div className={styles.product_container}>
              <div className={styles.barcodes_container}>
                <EndingGoodsProductItem name="Штрихкоды" />
                <div className={styles.barcodes}>
                  {barcodes.length ? (
                    barcodes.map((barcode, index) =>
                      barcode.ean13 ? (
                        <CopiedItem text={barcode.ean13} key={index} />
                      ) : null
                    )
                  ) : (
                    <CopiedItem text={NOT_INDICATED} />
                  )}
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.info_columns}>
                  <div className={styles.info_column}>
                    {type === 'product' && (
                      <EndingGoodsProductItem name="Артикул" />
                    )}
                    <EndingGoodsProductItem name="Код" />
                    <EndingGoodsProductItem name="Поставщик" />
                    <EndingGoodsProductItem name="Закупочная цена" />
                    <EndingGoodsProductItem name="Неснижаемый остаток" />
                    {stores.map((store) => (
                      <EndingGoodsProductItem
                        name={store.name}
                        key={store.name}
                      />
                    ))}
                  </div>
                  <div className={styles.info_column}>
                    {type === 'product' && (
                      <div className={styles.splitted_items}>
                        {articles.map((article) => (
                          <CopiedItem text={article.trim()} key={article} />
                        ))}
                      </div>
                    )}
                    <div className={styles.splitted_items}>
                      {codes.map((code) => (
                        <CopiedItem text={code.trim()} key={code} />
                      ))}
                    </div>
                    <CopiedItem text={supplier} />
                    <CopiedItem text={buyPrice} />
                    <CopiedItem text={minimumBalance} />
                    {stores.map((store) => (
                      <CopiedItem
                        text={store.stock}
                        isDanger={store.stock < minimumBalance}
                        key={store.name}
                      />
                    ))}
                  </div>
                </div>
                {description && (
                  <>
                    <div className={styles.description_title}>Комментарий</div>
                    <div className={styles.description}>{description}</div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.controls}>
              <Button onClick={openEditProductModal}>Редактировать</Button>
              <Button onClick={toggleNotAvailable}>
                {!productModal.notification?.notAvailable
                  ? 'Нет в наличии'
                  : 'Есть в наличии'}
              </Button>
              <Button variant={ButtonVariants.primary} onClick={toggleOrdered}>
                {!productModal.notification?.ordered
                  ? 'Заказано'
                  : 'Не заказано'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EndingGoodsProductModal;
