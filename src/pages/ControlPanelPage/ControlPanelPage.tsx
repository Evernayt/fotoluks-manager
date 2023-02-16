import { Navmenu } from 'components';
import ControlPanelSidemenu from './Sidemenu/ControlPanelSidemenu';
import { useAppSelector } from 'hooks/redux';
import styles from './ControlPanelPage.module.scss';
import ControlPanelSearch from './Search/ControlPanelSearch';
import {
  ControlPanelCategoriesTable,
  ControlPanelFeaturesTable,
  ControlPanelParamsTable,
  ControlPanelProductsTable,
  ControlPanelShopsTable,
  ControlPanelTypesTable,
  ControlPanelUsersTable,
  ControlPanelEmployeesTable,
} from './Tables';
import {
  ControlPanelCategoriesFilterModal,
  ControlPanelEditCategoryModal,
  ControlPanelEditProductModal,
  ControlPanelEditTypeModal,
  ControlPanelEditTypeParamsModal,
  ControlPanelEditUserModal,
  ControlPanelProductsFilterModal,
  ControlPanelTypesFilterModal,
  ControlPanelUsersFilterModal,
  ControlPanelFeaturesFilterModal,
  ControlPanelEditFeatureModal,
  ControlPanelParamsFilterModal,
  ControlPanelEditParamModal,
  ControlPanelShopsFilterModal,
  ControlPanelEditShopModal,
  ControlPanelEmployeesFilterModal,
  ControlPanelEditEmployeeModal,
} from './Modals';

const ControlPanelPage = () => {
  const activeTableId = useAppSelector(
    (state) => state.controlPanel.activeTableId
  );

  const renderTable = () => {
    switch (activeTableId) {
      case 1:
        return <ControlPanelEmployeesTable />;
      case 2:
        return <ControlPanelUsersTable />;
      case 3:
        return <ControlPanelTypesTable />;
      case 4:
        return <ControlPanelProductsTable />;
      case 5:
        return <ControlPanelCategoriesTable />;
      case 6:
        return <ControlPanelFeaturesTable />;
      case 7:
        return <ControlPanelParamsTable />;
      case 8:
        return <ControlPanelShopsTable />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <ControlPanelEditUserModal />
      <ControlPanelUsersFilterModal />
      <ControlPanelEditTypeModal />
      <ControlPanelTypesFilterModal />
      <ControlPanelEditTypeParamsModal />
      <ControlPanelProductsFilterModal />
      <ControlPanelEditProductModal />
      <ControlPanelCategoriesFilterModal />
      <ControlPanelEditCategoryModal />
      <ControlPanelEditParamModal />
      <ControlPanelFeaturesFilterModal />
      <ControlPanelEditFeatureModal />
      <ControlPanelParamsFilterModal />
      <ControlPanelShopsFilterModal />
      <ControlPanelEditShopModal />
      <ControlPanelEmployeesFilterModal />
      <ControlPanelEditEmployeeModal />
      <Navmenu searchRender={() => <ControlPanelSearch />} />
      <div className={styles.section}>
        <ControlPanelSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default ControlPanelPage;
