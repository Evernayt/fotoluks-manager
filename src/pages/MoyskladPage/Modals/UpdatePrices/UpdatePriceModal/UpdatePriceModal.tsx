import { UpdateProductDto } from 'api/MoyskladAPI/dto/update-product.dto';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Button, Loader, Modal } from 'components';
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

const UpdatePriceModal = () => {
  const [positions, setPositions] = useState<IPosition[]>([]);
  const [positionsToUpdate, setPositionsToUpdate] = useState<
    IPositionToUpdate[]
  >([]);
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
    MoyskladAPI.getSupplyPositions({ id: updatePriceModal.id })
      .then((data) => {
        setPositions(data.rows);

        const toUpdate: IPositionToUpdate[] = [];
        data.rows.forEach((position) => {
          if (position.gtd) {
            const newPrice = position.gtd.name
              .replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')
              .replace(/[^0-9]/g, '');

            if (newPrice.length > 0) {
              toUpdate.push({ position, newPrice: Number(newPrice) });
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

    positionsToUpdate.forEach((positionToUpdate) => {
      if (positionToUpdate.position.assortment.meta.type === 'product') {
        const salePrices = positionToUpdate.position.assortment.salePrices;
        if (!salePrices) return;

        const newSalePrices = getNewSalePrices(
          salePrices,
          positionToUpdate.newPrice
        );
        if (newSalePrices.length === 0) return;

        const product: UpdateProductDto = {
          ...positionToUpdate.position.assortment,
          salePrices: newSalePrices,
        };

        products.push(product);
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
      }
    });

    MoyskladAPI.updateProducts(products).then(() => {
      if (!variantsToUpdate.length) {
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
          if (newSalePrices.length === 0) return;

          const product: UpdateProductDto = {
            ...data,
            salePrices: newSalePrices,
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
  };

  const clearPrices = () => {
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
      .then(() => setPositionsToUpdate([]))
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
            <div className={styles.controls}>
              <Button
                disabled={positionsToUpdate.length < 1}
                onClick={clearPrices}
              >
                Очистить цены
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
