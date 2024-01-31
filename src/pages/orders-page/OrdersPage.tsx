import { Card } from '@chakra-ui/react';
import OrdersTable from './components/table/OrdersTable';
import OrdersSidebar from './components/OrdersSidebar';
import OrdersFilterModal from './modals/filter-modal/OrdersFilterModal';
import OrdersExportModal from './modals/export-modal/OrdersExportModal';
import OrdersInfoModal from './modals/info-modal/OrderInfoModal';
import OrderShopModal from './modals/shop-modal/OrderShopModal';
import { OrderReasonModal } from 'components';
import styles from './OrdersPage.module.scss';

const OrdersPage = () => {
  return (
    <div className={styles.container}>
      <OrderReasonModal />
      <OrderShopModal />
      <OrdersInfoModal />
      <OrdersFilterModal />
      <OrdersExportModal />
      <OrdersSidebar />
      <Card className={styles.panel}>
        <OrdersTable />
      </Card>
    </div>
  );
};

export default OrdersPage;
