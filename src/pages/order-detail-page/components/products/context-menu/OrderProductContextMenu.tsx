import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import { ContextMenu } from 'components';
import 'react-contexify/ReactContexify.css';
import { IOrderProduct } from 'models/api/IOrderProduct';
import { orderActions } from 'store/reducers/OrderSlice';
import { getMainFolder } from 'helpers/localStorage';
import { removeBeforeString } from 'helpers';
import {
  CONTEXT_MENU_ICON_STYLE,
  ICON_SIZE,
  ICON_STROKE,
  MAIN_FOLDER_NAME,
} from 'constants/app';
import {
  IconFolderOpen,
  IconFolderPlus,
  IconFolderX,
  IconTrash,
} from '@tabler/icons-react';

export const ORDER_PRODUCT_MENU_ID = 'ORDER_PRODUCT_MENU_ID';

const OrderProductContextMenu = () => {
  const orderProductsForCreate = useAppSelector(
    (state) => state.order.orderProductsForCreate
  );
  const orderFiles = useAppSelector((state) => state.order.order.orderFiles);

  const dispatch = useAppDispatch();

  const pinFolder = (params: ItemParams<IOrderProduct>) => {
    const orderProduct = params.props;
    if (!orderProduct) return;
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

  const unpinFolder = (params: ItemParams<IOrderProduct>) => {
    const orderProduct = params.props;
    if (!orderProduct) return;

    const updatedOrderProduct = { ...orderProduct, folder: '' };

    const isFoundForCreate = orderProductsForCreate.find(
      (x) => x.id === orderProduct.id
    );

    if (isFoundForCreate) {
      dispatch(orderActions.addOrderProductsForCreate(updatedOrderProduct));
    } else {
      dispatch(orderActions.addOrderProductsForUpdate(updatedOrderProduct));
    }

    dispatch(orderActions.updateOrderProduct(updatedOrderProduct));
  };

  const openFolder = (params: ItemParams<IOrderProduct>) => {
    const orderProduct = params.props;
    if (!orderProduct) return;
    const mainFolder = getMainFolder();
    const folderPath = mainFolder + orderProduct.folder;
    window.electron.ipcRenderer.sendMessage('open-folder', [folderPath]);
  };

  const deleteOrderProduct = (params: ItemParams<IOrderProduct>) => {
    const orderProduct = params.props;
    if (!orderProduct) return;

    dispatch(orderActions.deleteOrderProduct(orderProduct.id));

    const orderProductForCreate = orderProductsForCreate.find(
      (x) => x.id === orderProduct.id
    );
    if (!orderProductForCreate) {
      dispatch(orderActions.addOrderProductsForDelete(Number(orderProduct.id)));
    }

    const createdOrderFiles = orderFiles?.filter(
      (x) => x.orderProductId === orderProduct.id && typeof x.id === 'number'
    );
    if (createdOrderFiles) {
      const ids = createdOrderFiles.map((x) => x.id);
      dispatch(orderActions.addOrderFilesForDelete(ids as number[]));
    }
    dispatch(
      orderActions.deleteOrderFilePathForUploadByOrderProductId(orderProduct.id)
    );
    dispatch(orderActions.deleteOrderFilesByOrderProductId(orderProduct.id));
  };

  const isHidden = (params: ItemParams<IOrderProduct>) => {
    return params.props?.folder ? false : true;
  };

  return (
    <ContextMenu id={ORDER_PRODUCT_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={openFolder}>
        <IconFolderOpen
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Открыть папку
      </Item>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={unpinFolder}>
        <IconFolderX
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Открепить папку
      </Item>
      <Item hidden={(e) => !isHidden(e as ItemParams)} onClick={pinFolder}>
        <IconFolderPlus
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Закрепить папку
      </Item>
      <Item onClick={deleteOrderProduct}>
        <IconTrash
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Удалить
      </Item>
    </ContextMenu>
  );
};

export default OrderProductContextMenu;
