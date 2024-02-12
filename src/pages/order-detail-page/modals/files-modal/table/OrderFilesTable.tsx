import { Table } from 'components';
import { orderFilesTableColumns } from './OrderFilesTable.colums';
import { FC } from 'react';
import { useContextMenu } from 'react-contexify';
import OrderFileContextMenu, {
  ORDER_FILE_MENU_ID,
} from './context-menu/OrderFileContextMenu';
import { Row } from '@tanstack/react-table';
import { IOrderFile } from 'models/api/IOrderFile';
import { Heading } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/redux';
import { IOrderProduct } from 'models/api/IOrderProduct';

interface OrderFilesTableProps {
  orderFilesGroup: IOrderFile[][];
}

const OrderFilesTable: FC<OrderFilesTableProps> = ({ orderFilesGroup }) => {
  const orderProducts = useAppSelector(
    (state) => state.order.order.orderProducts
  );

  const { show } = useContextMenu({ id: ORDER_FILE_MENU_ID });

  const getProductName = (
    orderProductId: string | number,
    orderProduct?: IOrderProduct
  ) => {
    if (orderProduct) {
      return orderProduct?.product?.name;
    } else {
      return orderProducts?.find((x) => x.id === orderProductId)?.product?.name;
    }
  };

  const handleContextMenu = (row: Row<IOrderFile>, event: any) => {
    show({ event, props: row.original });
  };

  return (
    <>
      <OrderFileContextMenu />
      <div style={{ maxHeight: '450px', overflow: 'auto' }}>
        {orderFilesGroup.map((orderFiles) => (
          <div key={orderFiles[0].id}>
            {orderFilesGroup.length > 1 && (
              <Heading
                size="sm"
                p="0 21px"
                mt="var(--space-lg)"
                mb="var(--space-sm)"
              >
                {getProductName(
                  orderFiles[0].orderProductId,
                  orderFiles[0].orderProduct
                )}
              </Heading>
            )}
            <Table
              columns={orderFilesTableColumns}
              data={orderFiles}
              hideHeader
              onContextMenu={handleContextMenu}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderFilesTable;
