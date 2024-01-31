import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { UpdateProductDto } from 'api/MoyskladAPI/dto/update-product.dto';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IPosition } from 'models/api/moysklad/IPosition';
import { useEffect, useState } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import { getNewSalePrices } from './UpdatesPriceModal.service';
import { Loader } from 'components';
import { getErrorToast } from 'helpers/toast';

interface IPositionToUpdate {
  position: IPosition;
  newPrice: number;
}

interface IVariantToUpdate {
  productId: string;
  newPrice: number;
}

interface IUpdatedPosition {
  id: string;
  mark: string;
}

const UpdatePricesModal = () => {
  const [positions, setPositions] = useState<IPosition[]>([]);
  const [positionsToUpdate, setPositionsToUpdate] = useState<
    IPositionToUpdate[]
  >([]);
  const [markedPositionsCount, setMarkedPositionsCount] = useState<number>(0);
  const [markPrices, setMarkPrices] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen, id, name } = useAppSelector(
    (state) => state.modal.updatePricesModal
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchSupplyPositions();
    }
  }, [isOpen]);

  const fetchSupplyPositions = () => {
    setIsLoading(true);
    setMarkedPositionsCount(0);
    MoyskladAPI.getSupplyPositions({ id })
      .then((data) => {
        setPositions(data.rows || []);

        const toUpdate: IPositionToUpdate[] = [];
        data.rows?.forEach((position) => {
          if (position.gtd) {
            if (position.gtd.name === '↑' || position.gtd.name === '↓↓↓') {
              setMarkedPositionsCount((prevState) => prevState + 1);
            } else {
              const newPrice = position.gtd.name
                .replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')
                .replace(/[^0-9]/g, '');

              if (newPrice.length > 0) {
                toUpdate.push({ position, newPrice: Number(newPrice) });
              }
            }
          }
        });

        setPositionsToUpdate(toUpdate);
      })
      .catch(() =>
        toast(getErrorToast('UpdatePricesModal.fetchSupplyPositions'))
      )
      .finally(() => setIsLoading(false));
  };

  const updatePrices = () => {
    setIsLoading(true);

    const products: UpdateProductDto[] = [];
    const variantsToUpdate: IVariantToUpdate[] = [];
    const updatedPositions: IUpdatedPosition[] = [];

    positionsToUpdate.forEach((positionToUpdate) => {
      if (positionToUpdate.position.assortment?.meta.type === 'product') {
        const salePrices = positionToUpdate.position.assortment.salePrices;
        if (!salePrices) return;

        const newSalePrices = getNewSalePrices(
          salePrices,
          positionToUpdate.newPrice
        );
        if (newSalePrices.salePrices.length === 0) return;

        const product: UpdateProductDto = {
          ...positionToUpdate.position.assortment,
          salePrices: newSalePrices.salePrices,
        };

        products.push(product);

        if (markPrices) {
          updatedPositions.push({
            id: positionToUpdate.position.id!,
            mark: newSalePrices.mark,
          });
        }
      } else if (
        positionToUpdate.position.assortment?.meta.type === 'variant'
      ) {
        const productId =
          positionToUpdate.position.assortment.product?.meta.href
            .split('/')
            .pop();

        const isDuplicate = variantsToUpdate.find(
          (x) => x.productId === productId
        );

        if (productId && !isDuplicate) {
          variantsToUpdate.push({
            productId,
            newPrice: positionToUpdate.newPrice,
          });
        }

        if (markPrices) {
          const salePrices = positionToUpdate.position.assortment.salePrices;
          if (!salePrices) return;
          const newSalePrices = getNewSalePrices(
            salePrices,
            positionToUpdate.newPrice
          );
          updatedPositions.push({
            id: positionToUpdate.position.id!,
            mark: newSalePrices.mark,
          });
        }
      }
    });

    MoyskladAPI.updateProducts(products)
      .then(() => {
        if (!variantsToUpdate.length && !markPrices) {
          setIsLoading(false);
        }

        const variantProducts: UpdateProductDto[] = [];
        variantsToUpdate.forEach((variantToUpdate) => {
          MoyskladAPI.getProduct(variantToUpdate.productId).then((data) => {
            const salePrices = data.salePrices;
            if (!salePrices) return;

            const newSalePrices = getNewSalePrices(
              salePrices,
              variantToUpdate.newPrice
            );
            if (newSalePrices.salePrices.length === 0) return;

            const product: UpdateProductDto = {
              ...data,
              salePrices: newSalePrices.salePrices,
            };
            variantProducts.push(product);

            if (variantProducts.length === variantsToUpdate.length) {
              MoyskladAPI.updateProducts(variantProducts)
                .catch(() =>
                  toast(
                    getErrorToast('UpdatePricesModal.updatePrices.updatePrices')
                  )
                )
                .finally(() => setIsLoading(false));
            }
          });
        });
      })
      .catch(() => {
        toast(getErrorToast('UpdatePricesModal.updatePrices.updatePrices'));
        setIsLoading(false);
      });

    if (markPrices) {
      const markedPositions: any[] = [];
      positions.forEach((position) => {
        const updatedPosition = updatedPositions.find(
          (x) => x.id === position.id
        );
        if (updatedPosition) {
          markedPositions.push({
            gtd: { name: updatedPosition.mark },
            quantity: position.quantity,
            price: position.price,
            assortment: { meta: position.assortment?.meta },
          });
        } else {
          markedPositions.push({
            gtd: { name: '' },
            quantity: position.quantity,
            price: position.price,
            assortment: { meta: position.assortment?.meta },
          });
        }
      });

      MoyskladAPI.updateSupply({ id, positions: markedPositions })
        .then(() => {
          closeModal();
        })
        .catch(() =>
          toast(getErrorToast('UpdatePricesModal.updatePrices.updateSupply'))
        )
        .finally(() => setIsLoading(false));
    } else {
      closeModal();
    }
  };

  const clear = () => {
    setIsLoading(true);

    const clearedPositions: any[] = [];
    positions.forEach((position) => {
      clearedPositions.push({
        gtd: { name: '' },
        quantity: position.quantity,
        price: position.price,
        assortment: { meta: position.assortment?.meta },
      });
    });

    MoyskladAPI.updateSupply({ id, positions: clearedPositions })
      .then(() => {
        closeModal();
      })
      .catch(() => toast(getErrorToast('UpdatePricesModal.clear.updateSupply')))
      .finally(() => setIsLoading(false));
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('updatePricesModal'));
    setPositions([]);
    setPositionsToUpdate([]);
    setMarkedPositionsCount(0);
    setMarkPrices(true);
    setIsLoading(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent>
        {isLoading ? (
          <Loader minHeight="215px" />
        ) : (
          <>
            <ModalHeader>
              {`Приемка № ${name}`}
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              {' '}
              <>
                <Text>{`Всего позиций: ${positions.length}`}</Text>
                <Text>{`Новых цен: ${positionsToUpdate.length}`}</Text>
                <Text>{`Возрастающие и убывающие отметки: ${markedPositionsCount}`}</Text>
                <FormControl
                  flexDirection="row"
                  display="flex"
                  alignItems="center"
                >
                  <FormLabel mb={0}>
                    Отметить возрастающие и убывающие цены
                  </FormLabel>
                  <Switch
                    isChecked={markPrices}
                    onChange={() => setMarkPrices((prevState) => !prevState)}
                  />
                </FormControl>
              </>
            </ModalBody>
            <ModalFooter gap="var(--space-sm)">
              <Button
                isDisabled={
                  positionsToUpdate.length < 1 && markedPositionsCount < 1
                }
                w="100%"
                onClick={clear}
              >
                Очистить
              </Button>
              <Button
                colorScheme="yellow"
                isDisabled={positionsToUpdate.length < 1}
                w="100%"
                onClick={updatePrices}
              >
                Обновить цены
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdatePricesModal;
