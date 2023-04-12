import { UpdateProductDto } from 'api/MoyskladAPI/dto/update-product.dto';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Button, Checkbox, Loader, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IPosition } from 'models/api/moysklad/IPosition';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { getNewSalePrices } from './UpdatePriceModal.service';
import styles from './UpdatePriceModal.module.scss';

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

const UpdatePriceModal = () => {
  const [positions, setPositions] = useState<IPosition[]>([]);
  const [positionsToUpdate, setPositionsToUpdate] = useState<
    IPositionToUpdate[]
  >([]);
  const [markedPositionsCount, setMarkedPositionsCount] = useState<number>(0);
  const [markPrices, setMarkPrices] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updatePriceModal = useAppSelector(
    (state) => state.modal.updatePriceModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (updatePriceModal.isShowing) {
      fetchSupplyPositions();
    }
  }, [updatePriceModal.isShowing]);

  const fetchSupplyPositions = () => {
    setIsLoading(true);
    setMarkedPositionsCount(0);
    MoyskladAPI.getSupplyPositions({ id: updatePriceModal.id })
      .then((data) => {
        setPositions(data.rows);

        const toUpdate: IPositionToUpdate[] = [];
        data.rows.forEach((position) => {
          if (position.gtd) {
            if (position.gtd.name === '↑' || position.gtd.name === '↓') {
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
      .finally(() => setIsLoading(false));
  };

  const updatePrices = () => {
    setIsLoading(true);

    const products: UpdateProductDto[] = [];
    const variantsToUpdate: IVariantToUpdate[] = [];
    const updatedPositions: IUpdatedPosition[] = [];

    positionsToUpdate.forEach((positionToUpdate) => {
      if (positionToUpdate.position.assortment.meta.type === 'product') {
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
      } else if (positionToUpdate.position.assortment.meta.type === 'variant') {
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

    MoyskladAPI.updateProducts(products).then(() => {
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
            MoyskladAPI.updateProducts(variantProducts).finally(() =>
              setIsLoading(false)
            );
          }
        });
      });
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
            assortment: { meta: position.assortment.meta },
          });
        } else {
          markedPositions.push({
            gtd: { name: '' },
            quantity: position.quantity,
            price: position.price,
            assortment: { meta: position.assortment.meta },
          });
        }
      });

      MoyskladAPI.updateSupply({
        id: updatePriceModal.id,
        positions: markedPositions,
      })
        .then(() => {
          setMarkedPositionsCount(positionsToUpdate.length);
          setPositionsToUpdate([]);
        })
        .finally(() => setIsLoading(false));
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
        assortment: { meta: position.assortment.meta },
      });
    });

    MoyskladAPI.updateSupply({
      id: updatePriceModal.id,
      positions: clearedPositions,
    })
      .then(() => {
        setPositionsToUpdate([]);
        setMarkedPositionsCount(0);
      })
      .finally(() => setIsLoading(false));
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('updatePriceModal'));
  };

  return (
    <Modal
      title={`Приемка № ${updatePriceModal.name}`}
      isShowing={updatePriceModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div>{`Всего позиций: ${positions.length}`}</div>
            <div>{`Новых цен: ${positionsToUpdate.length}`}</div>
            <div>{`Возрастающие и убывающие отметки: ${markedPositionsCount}`}</div>
            <Checkbox
              containerClassName={styles.checkbox}
              text="Отметить возрастающие и убывающие цены"
              checked={markPrices}
              onChange={() => setMarkPrices((prevState) => !prevState)}
            />
            <div className={styles.controls}>
              <Button
                disabled={
                  positionsToUpdate.length < 1 && markedPositionsCount < 1
                }
                onClick={clear}
              >
                Очистить
              </Button>
              <Button
                variant={ButtonVariants.primary}
                disabled={positionsToUpdate.length < 1}
                onClick={updatePrices}
              >
                Обновить цены
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UpdatePriceModal;
