import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { NOT_INDICATED } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IBarcode } from 'models/api/moysklad/IBarcode';
import { IStore } from 'models/api/moysklad/IStore';
import { useEffect, useState } from 'react';
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import { CopyWrapper } from 'components';
import Loader from 'components/ui/loader/Loader';
import EndingGoodsEditProductModal from '../edit-product-modal/EndingGoodsEditProductModal';
import { getErrorToast } from 'helpers/toast';
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

  const { isOpen, endingGood } = useAppSelector(
    (state) => state.modal.endingGoodsProductModal
  );
  const forceUpdateProduct = useAppSelector(
    (state) => state.endingGoods.forceUpdateProduct
  );

  const editProductModal = useDisclosure();
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchProduct();
    }
  }, [isOpen]);

  useEffect(() => {
    if (forceUpdateProduct) {
      fetchProduct();
      dispatch(endingGoodsActions.setForceUpdateProduct(false));
    }
  }, [forceUpdateProduct]);

  const fetchProduct = () => {
    if (!endingGood) return;
    setIsLoading(true);

    MoyskladAPI.getProduct(endingGood.good.id).then((productData) => {
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
        MoyskladAPI.getAssortment({ search: endingGood.good.name })
          .then((assortmentData) => {
            if (!assortmentData?.rows) return;
            const variant = assortmentData?.rows[0];
            if (!variant) return;
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
                if (!stockData.rows) return;
                setStores(stockData.rows[0].stockByStore);
              })
              .catch(() =>
                toast(getErrorToast('EndingGoodsProductModal.getStocks'))
              )
              .finally(() => setIsLoading(false));
          })
          .catch(() =>
            toast(getErrorToast('EndingGoodsProductModal.getAssortment'))
          );
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
            if (!stockData.rows) return;
            setStores(stockData.rows[0].stockByStore);
          })
          .catch(() =>
            toast(getErrorToast('EndingGoodsProductModal.getStocks'))
          )
          .finally(() => setIsLoading(false));
      }
    });
  };

  const toggleOrdered = () => {
    if (!endingGood) return;
    const { good, ordered } = endingGood;

    dispatch(endingGoodsActions.toggleOrderedByGoodId(good.id));
    if (ordered) {
      dispatch(endingGoodsActions.removeOrderedGood(good.id));
    } else {
      dispatch(endingGoodsActions.addOrderedGood(good.id));
    }
    closeModal();
  };

  const toggleNotAvailable = () => {
    if (!endingGood) return;
    const { good, notAvailable } = endingGood;

    dispatch(endingGoodsActions.toggleNotAvailableByGoodId(good.id));
    if (notAvailable) {
      dispatch(endingGoodsActions.removeNotAvailableGood(good.id));
    } else {
      dispatch(endingGoodsActions.addNotAvailableGood(good.id));
    }
    closeModal();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('endingGoodsProductModal'));
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
    <>
      <EndingGoodsEditProductModal
        type={type}
        productId={productId}
        isOpen={editProductModal.isOpen}
        onClose={editProductModal.onClose}
      />
      <Modal isOpen={isOpen} onClose={closeModal} size="3xl">
        <ModalOverlay />
        <ModalContent>
          {isLoading ? (
            <Loader minHeight="480px" />
          ) : (
            <>
              <ModalHeader>{name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div className={styles.product_container}>
                  <div className={styles.barcodes_container}>
                    <Heading size="sm" py="2.1px">
                      Штрихкоды
                    </Heading>
                    <div className={styles.barcodes}>
                      {barcodes.length ? (
                        barcodes.map((barcode, index) =>
                          barcode.ean13 ? (
                            <CopyWrapper text={barcode.ean13} key={index}>
                              <Tag>{barcode.ean13}</Tag>
                            </CopyWrapper>
                          ) : null
                        )
                      ) : (
                        <Tag>{NOT_INDICATED}</Tag>
                      )}
                    </div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.info_columns}>
                      <div className={styles.info_column}>
                        {type === 'product' && (
                          <Heading size="sm" py="2.1px">
                            Артикул
                          </Heading>
                        )}
                        <Heading size="sm" py="2.1px">
                          Код
                        </Heading>
                        <Heading size="sm" py="2.1px">
                          Поставщик
                        </Heading>
                        <Heading size="sm" py="2.1px">
                          Закупочная цена
                        </Heading>
                        <Heading size="sm" py="2.1px">
                          Неснижаемый остаток
                        </Heading>
                        {stores.map((store) => (
                          <Heading size="sm" py="2.1px" key={store.name}>
                            {store.name}
                          </Heading>
                        ))}
                      </div>
                      <div className={styles.info_column}>
                        {type === 'product' && (
                          <div className={styles.splitted_items}>
                            {articles.map((article) => (
                              <CopyWrapper text={article.trim()} key={article}>
                                <Tag>{article.trim()}</Tag>
                              </CopyWrapper>
                            ))}
                          </div>
                        )}
                        <div className={styles.splitted_items}>
                          {codes.map((code) => (
                            <CopyWrapper text={code.trim()} key={code}>
                              <Tag>{code.trim()}</Tag>
                            </CopyWrapper>
                          ))}
                        </div>
                        <CopyWrapper text={supplier}>
                          <Tag>{supplier}</Tag>
                        </CopyWrapper>
                        <CopyWrapper text={buyPrice.toString()}>
                          <Tag>{buyPrice}</Tag>
                        </CopyWrapper>
                        <CopyWrapper text={minimumBalance.toString()}>
                          <Tag>{minimumBalance}</Tag>
                        </CopyWrapper>
                        {stores.map((store) => (
                          <CopyWrapper
                            text={store.stock.toString()}
                            key={store.name}
                          >
                            <Tag
                              colorScheme={
                                store.stock < minimumBalance ? 'red' : 'gray'
                              }
                            >
                              {store.stock}
                            </Tag>
                          </CopyWrapper>
                        ))}
                      </div>
                    </div>
                    {description && (
                      <>
                        <Heading size="sm">Комментарий</Heading>
                        <Tag
                          className={styles.description}
                          display="block"
                          h="100%"
                        >
                          {description}
                        </Tag>
                      </>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className={styles.footer}>
                <Button w="100%" onClick={editProductModal.onOpen}>
                  Редактировать
                </Button>
                <Button w="100%" onClick={toggleNotAvailable}>
                  {endingGood?.notAvailable
                    ? 'Не игнорировать'
                    : 'Игнорировать'}
                </Button>
                <Button w="100%" colorScheme="yellow" onClick={toggleOrdered}>
                  {endingGood?.ordered ? 'Не заказано' : 'Заказано'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EndingGoodsProductModal;
