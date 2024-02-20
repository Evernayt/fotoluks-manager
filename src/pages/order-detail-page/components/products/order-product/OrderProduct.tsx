import { Card, CardBody, Heading, IconButton, Text } from '@chakra-ui/react';
import { IOrderProduct } from 'models/api/IOrderProduct';
import { FC, useDeferredValue } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useContextMenu } from 'react-contexify';
import { ORDER_PRODUCT_MENU_ID } from '../context-menu/OrderProductContextMenu';
import { modalActions } from 'store/reducers/ModalSlice';
import { MAIN_FOLDER_NAME, MODES } from 'constants/app';
import { noImage } from 'constants/images';
import { calcSumWithDiscount } from 'pages/order-detail-page/OrderDetailPage.service';
import styles from './OrderProduct.module.scss';
import { IconFolderOpen, IconFolderPlus, IconTrash } from '@tabler/icons-react';
import { getMainFolder } from 'helpers/localStorage';
import { removeBeforeString } from 'helpers';
import { orderActions } from 'store/reducers/OrderSlice';

interface OrderProductProps {
  orderProduct: IOrderProduct;
  orderDiscount: number;
}

const OrderProduct: FC<OrderProductProps> = ({
  orderProduct,
  orderDiscount,
}) => {
  const orderProductsForCreate = useAppSelector(
    (state) => state.order.orderProductsForCreate
  );

  const deferredDiscount = useDeferredValue(orderProduct.discount);

  const currectDiscount = orderProduct.product?.discountProhibited
    ? 0
    : deferredDiscount || orderDiscount;
  const sumWithDiscount = calcSumWithDiscount(
    currectDiscount,
    orderProduct.quantity,
    orderProduct.price
  );

  const dispatch = useAppDispatch();
  const { show } = useContextMenu({ id: ORDER_PRODUCT_MENU_ID });

  const openEditProductModal = (orderProduct: IOrderProduct) => {
    dispatch(
      modalActions.openModal({
        modal: 'orderProductEditModal',
        props: { mode: MODES.EDIT_MODE, orderProduct },
      })
    );
  };

  const handleContextMenu = (orderProduct: IOrderProduct, event: any) => {
    show({ event, props: orderProduct });
  };

  const openFolder = () => {
    const mainFolder = getMainFolder();
    const folderPath = mainFolder + orderProduct.folder;
    window.electron.ipcRenderer.sendMessage('open-folder', [folderPath]);
  };

  const pinFolder = () => {
    const mainFolder = getMainFolder();

    window.electron.ipcRenderer.sendMessage('select-directory', [mainFolder]);
    window.electron.ipcRenderer.once('select-directory', (arg: any) => {
      const fullPath: string = arg[0][0];
      if (!fullPath) return;

      const folder = removeBeforeString(fullPath, MAIN_FOLDER_NAME);
      const updatedOrderProduct = { ...orderProduct, folder };

      const isFoundForCreate = orderProductsForCreate.find(
        (x) => x.id === orderProduct.id
      );

      if (isFoundForCreate) {
        dispatch(orderActions.addOrderProductsForCreate(updatedOrderProduct));
      } else {
        dispatch(orderActions.addOrderProductsForUpdate(updatedOrderProduct));
      }

      dispatch(orderActions.updateOrderProduct(updatedOrderProduct));
    });
  };

  return (
    <Card
      className={styles.container}
      onContextMenu={(e) => handleContextMenu(orderProduct, e)}
    >
      <div
        className={styles.left_section}
        onClick={() => openEditProductModal(orderProduct)}
      >
        <div className={styles.header}>
          <img
            className={styles.image}
            src={orderProduct.product?.image || noImage}
          />
          <div>
            <Heading size="sm" mb="var(--space-xs)">
              {orderProduct.product?.name}
            </Heading>
            <Text variant="secondary" fontSize="sm">
              {`Цена: ${orderProduct.price} руб. | Сумма: ${parseFloat(
                sumWithDiscount.toFixed(2)
              )} руб.`}
            </Text>
            <Text variant="secondary" fontSize="sm">
              {`Количество: ${orderProduct.quantity} шт.`}
            </Text>
          </div>
        </div>
        {orderProduct.comment && (
          <Text mt="var(--space-sm)">{orderProduct.comment}</Text>
        )}
      </div>
      <div className={styles.right_section}>
        {orderProduct.folder ? (
          <IconButton
            icon={<IconFolderOpen size={14} />}
            aria-label="open"
            isRound
            size="xs"
            onClick={openFolder}
          />
        ) : (
          <IconButton
            icon={<IconFolderPlus size={14} />}
            aria-label="pin"
            isRound
            size="xs"
            onClick={pinFolder}
          />
        )}
      </div>
    </Card>
  );
};

export default OrderProduct;
