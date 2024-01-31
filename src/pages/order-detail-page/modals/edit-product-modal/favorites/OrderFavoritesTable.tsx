import { useAppSelector } from 'hooks/redux';
import { Table } from 'components';
import { orderFavoritesTableColumns } from './OrderFavoritesTable.colums';
import { IFavorite } from 'models/api/IFavorite';
import { Divider } from '@chakra-ui/react';
import { useContextMenu } from 'react-contexify';
import OrderFavoriteContextMenu, {
  ORDER_FAVORITE_MENU_ID,
} from './context-menu/OrderFavoriteContextMenu';
import { IProduct } from 'models/api/IProduct';
import { FC } from 'react';
import { Row } from '@tanstack/react-table';

interface OrderFavoritesTableProps {
  selectProduct: (product: IProduct) => void;
}

const OrderFavoritesTable: FC<OrderFavoritesTableProps> = ({
  selectProduct,
}) => {
  const favorites = useAppSelector((state) => state.order.favorites);

  const { show } = useContextMenu({ id: ORDER_FAVORITE_MENU_ID });

  const rowClickHandler = (row: Row<IFavorite>) => {
    if (!row.original.product) return;
    selectProduct(row.original.product);
  };

  const handleContextMenu = (row: Row<IFavorite>, event: any) => {
    show({ event, props: row.original });
  };

  return favorites.length > 0 ? (
    <>
      <OrderFavoriteContextMenu />
      <Table
        columns={orderFavoritesTableColumns}
        data={favorites}
        containerStyle={{ flex: 1, maxHeight: '305px' }}
        notFoundTextProps={{ minHeight: '305px' }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
      <div>
        <Divider orientation="vertical" mx={4} />
      </div>
    </>
  ) : null;
};

export default OrderFavoritesTable;
