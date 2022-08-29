import { DropdownButton, IconButton } from 'components';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { dotsMenuIcon, editIcon } from 'icons';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { FC } from 'react';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrderDetailService.module.css';

interface OrderDetailServiceProps {
  finishedProduct: IFinishedProduct;
  openServiceModal: (mode: Modes, finishedProduct: IFinishedProduct) => void;
}

const OrderDetailService: FC<OrderDetailServiceProps> = ({
  finishedProduct,
  openServiceModal,
}) => {
  const finishedProductsForCreate = useAppSelector(
    (state) => state.order.finishedProductsForCreate
  );

  const dispatch = useAppDispatch();

  const deleteFinishedProduct = () => {
    dispatch(orderSlice.actions.deleteFinishedProduct(finishedProduct.id));
    const finishedProductForCreate = finishedProductsForCreate.find(
      (x) => x.id === finishedProduct.id
    );

    if (finishedProductForCreate === undefined) {
      dispatch(
        orderSlice.actions.addFinishedProductsForDelete(
          Number(finishedProduct.id)
        )
      );
    }
  };

  const serviceMenu = [
    {
      id: 1,
      name: 'Создать папку',
      onClick: () => console.log(finishedProduct),
    },
    {
      id: 2,
      name: 'Файлы',
      onClick: () => console.log('fa'),
    },
    {
      id: 3,
      name: 'Удалить',
      onClick: deleteFinishedProduct,
    },
  ];

  return (
    <div className={styles.card}>
      <div style={{ marginRight: '12px' }}>
        <div style={{ display: 'flex' }}>
          <img
            className={styles.img}
            src={
              finishedProduct.type.image === ''
                ? noImage
                : finishedProduct.type.image
            }
            alt=""
          />
          <div className={styles.info}>
            <span className={styles.text} style={{ fontSize: '16px' }}>
              {finishedProduct.product.name},{' '}
              {finishedProduct.type.name.toLowerCase()}
            </span>
            <div>
              {finishedProduct.selectedParams.map((selectedParam) => {
                if (!selectedParam.param) return;
                if (selectedParam.param.feature?.name === 'Цвет') {
                  return (
                    <div
                      className={styles.text}
                      style={{
                        marginRight: '8px',
                      }}
                      key={selectedParam.id}
                    >
                      {selectedParam.param.feature.name}:{' '}
                      <span
                        style={{
                          backgroundColor: `#${selectedParam.param.value}`,
                          padding: '2px 4px',
                          borderRadius: '8px',
                        }}
                      >
                        <span style={{ color: 'white' }}>
                          {selectedParam.param.name}
                        </span>
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <span
                      className={styles.text}
                      style={{ marginRight: '8px' }}
                      key={selectedParam.id}
                    >
                      {selectedParam.param.feature?.name}:{' '}
                      {selectedParam.param.value}
                    </span>
                  );
                }
              })}
            </div>
            <div>
              <span className={styles.text} style={{ marginRight: '8px' }}>
                Цена: {finishedProduct.price} р.
              </span>
              <span className={styles.text}>
                Кол-во: {finishedProduct.quantity} шт.
              </span>
            </div>
          </div>
        </div>
        {finishedProduct.comment !== null && (
          <div style={{ marginTop: '8px' }}>{finishedProduct.comment}</div>
        )}
      </div>

      <div className={styles.controls}>
        <IconButton
          icon={editIcon}
          style={{ marginBottom: '8px' }}
          onClick={() => openServiceModal(Modes.EDIT_MODE, finishedProduct)}
        />
        <DropdownButton
          options={serviceMenu}
          icon={dotsMenuIcon}
          placement={Placements.leftStart}
        />
      </div>
    </div>
  );
};

export default OrderDetailService;
