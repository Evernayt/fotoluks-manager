import { Navmenu } from 'components';
import OrdersSidemenu from './OrdersSidemenu/OrdersSidemenu';
import OrdersTable from './OrdersTable/OrdersTable';
import OrderInfoModal from './Modals/OrderInfoModal/OrderInfoModal';
import OrdersExportModal from './Modals/OrdersExportModal/OrdersExportModal';
import OrdersFilterModal from './Modals/OrdersFilterModal/OrdersFilterModal';
import OrderShopModal from './Modals/OrderShopModal/OrderShopModal';
import OrdersSearch from './OrdersSearch/OrdersSearch';
import styles from './OrdersPage.module.scss';

const OrdersPage = () => {
  return (
    <div className={styles.container}>
      <OrderInfoModal />
      <OrdersExportModal />
      <OrderShopModal />
      <OrdersFilterModal />
      <Navmenu searchRender={OrdersSearch} />
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
