import { Card } from '@chakra-ui/react';
import ControlSidebar from './components/ControlSidebar';
import { useAppSelector } from 'hooks/redux';
import ProductsTable from './components/tables/products/ProductsTable';
import ProductsEditModal from './modals/products/edit-modal/ProductsEditModal';
import UsersTable from './components/tables/users/UsersTable';
import EmployeesTable from './components/tables/employees/EmployeesTable';
import ShopsTable from './components/tables/shops/ShopsTable';
import ProductsFilterModal from './modals/products/filter-modal/ProductsFilterModal';
import UsersFilterModal from './modals/users/filter-modal/UsersFilterModal';
import EmployeesFilterModal from './modals/employees/filter-modal/EmployeesFilterModal';
import ShopsFilterModal from './modals/shops/filter-modal/ShopsFilterModal';
import EmployeeEditModal from './modals/employees/edit-modal/EmployeeEditModal';
import UserEditModal from './modals/users/edit-modal/UserEditModal';
import ShopsEditModal from './modals/shops/edit-modal/ShopsEditModal';
import ReportsTable from './components/tables/reports/ReportsTable';
import ChangelogsEditModal from './modals/changelogs/edit-modal/ChangelogsEditModal';
import Changelogs from './components/tables/changelogs/Changelogs';
import styles from './ControlPage.module.scss';

const ControlPage = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.control.activeSidebarIndex
  );

  const renderTable = () => {
    switch (activeSidebarIndex) {
      case 0:
        return <EmployeesTable />;
      case 1:
        return <UsersTable />;
      case 2:
        return <ProductsTable />;
      case 3:
        return <ShopsTable />;
      case 4:
        return <ReportsTable />;
      case 5:
        return <Changelogs />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <ChangelogsEditModal />
      <EmployeeEditModal />
      <EmployeesFilterModal />
      <UserEditModal />
      <UsersFilterModal />
      <ProductsEditModal />
      <ProductsFilterModal />
      <ShopsEditModal />
      <ShopsFilterModal />
      <ControlSidebar />
      <Card className={styles.panel}>{renderTable()}</Card>
    </div>
  );
};

export default ControlPage;
