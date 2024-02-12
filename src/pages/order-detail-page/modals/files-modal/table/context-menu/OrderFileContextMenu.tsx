import { IconTrash } from '@tabler/icons-react';
import { ContextMenu } from 'components';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch } from 'hooks/redux';
import { IOrderFile } from 'models/api/IOrderFile';
import { Item, ItemParams } from 'react-contexify';
import { orderActions } from 'store/reducers/OrderSlice';

export const ORDER_FILE_MENU_ID = 'ORDER_FILE_MENU_ID';

const OrderFileContextMenu = () => {
  const dispatch = useAppDispatch();

  const deleteFile = (params: ItemParams<IOrderFile>) => {
    const orderFile = params.props;
    if (!orderFile) return;

    dispatch(orderActions.deleteOrderFile(orderFile.id));
    dispatch(orderActions.addOrderFilesForDelete([orderFile.id as number]));
    if (orderFile.isWaitingUploading) {
      dispatch(
        orderActions.deleteOrderFilePathForUpload(orderFile.id as string)
      );
    }
  };

  return (
    <ContextMenu id={ORDER_FILE_MENU_ID}>
      <Item onClick={deleteFile}>
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

export default OrderFileContextMenu;
