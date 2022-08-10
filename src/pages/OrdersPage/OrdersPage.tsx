import { Navmenu } from 'components';
import OrdersSidemenu from './OrdersSidemenu/OrdersSidemenu';
import OrdersTable from './OrdersTable/OrdersTable';
import styles from './OrdersPage.module.css';
import OrderInfoModal from './Modals/OrderInfoModal/OrderInfoModal';
import OrdersExportModal from './Modals/OrdersExportModal/OrdersExportModal';
import OrdersFilterModal from './Modals/OrdersFilterModal/OrdersFilterModal';
import OrderShopModal from './Modals/OrderShopModal/OrderShopModal';
import OrdersSearch from './OrdersSearch/OrdersSearch';

const OrdersPage = () => {
  return (
    <div className={styles.container}>
      <OrderInfoModal />
      <OrdersExportModal />
      <OrdersFilterModal />
      <OrderShopModal />
      <Navmenu searchRender={() => <OrdersSearch />} />
      <div className={styles.section}>
        <OrdersSidemenu />
        <div className={styles.panel}>
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
