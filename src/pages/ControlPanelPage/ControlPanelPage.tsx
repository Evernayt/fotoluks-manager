import { Navmenu } from 'components';
import ControlPanelSidemenu from './ControlPanelSidemenu/ControlPanelSidemenu';
import ControlPanelUsersTable from './ControlPanelUsers/ControlPanelUsersTable/ControlPanelUsersTable';
import { useAppSelector } from 'hooks/redux';
import ControlPanelUsersFilterModal from './Modals/ControlPanelUsersFilterModal/ControlPanelUsersFilterModal';
import ControlPanelUsersSearch from './ControlPanelUsers/ControlPanelUsersSearch/ControlPanelUsersSearch';
import styles from './ControlPanelPage.module.css';
import ControlPanelEditUserModal from './Modals/ControlPanelEditUserModal/ControlPanelEditUserModal';
import ControlPanelTypesTable from './ControlPanelTypes/ControlPanelTypesTable/ControlPanelTypesTable';
import ControlPanelTypesSearch from './ControlPanelTypes/ControlPanelTypesSearch/ControlPanelTypesSearch';
import ControlPanelTypesFilterModal from './Modals/ControlPanelTypesFilterModal/ControlPanelTypesFilterModal';
import ControlPanelEditTypeModal from './Modals/ControlPanelEditTypeModal/ControlPanelEditTypeModal';
import ControlPanelEditProductModal from './Modals/ControlPanelEditProductModal/ControlPanelEditProductModal';
import ControlPanelEditCategoryModal from './Modals/ControlPanelEditCategoryModal/ControlPanelEditCategoryModal';
import ControlPanelEditTypeParamsModal from './Modals/ControlPanelEditTypeParamsModal/ControlPanelEditTypeParamsModal';
import ControlPanelProductsTable from './ControlPanelProducts/ControlPanelProductsTable/ControlPanelProductsTable';
import ControlPanelProductsSearch from './ControlPanelProducts/ControlPanelProductsSearch/ControlPanelProductsSearch';
import ControlPanelCategoriesTable from './ControlPanelCategories/ControlPanelCategoriesTable/ControlPanelCategoriesTable';
import ControlPanelCategoriesSearch from './ControlPanelCategories/ControlPanelCategoriesSearch/ControlPanelCategoriesSearch';
import ControlPanelCategoriesFilterModal from './Modals/ControlPanelCategoriesFilterModal/ControlPanelCategoriesFilterModal';
import ControlPanelProductsFilterModal from './Modals/ControlPanelProductsFilterModal/ControlPanelProductsFilterModal';
import ControlPanelFeaturesSearch from './ControlPanelFeatures/ControlPanelFeaturesSearch/ControlPanelFeaturesSearch';
import ControlPanelFeaturesTable from './ControlPanelFeatures/ControlPanelFeaturesTable/ControlPanelFeaturesTable';
import ControlPanelFeaturesFilterModal from './Modals/ControlPanelFeaturesFilterModal/ControlPanelFeaturesFilterModal';
import ControlPanelEditFeatureModal from './Modals/ControlPanelEditFeatureModal/ControlPanelEditFeatureModal';
import ControlPanelParamsTable from './ControlPanelParams/ControlPanelParamsTable/ControlPanelParamsTable';
import ControlPanelParamsSearch from './ControlPanelParams/ControlPanelParamsSearch/ControlPanelParamsSearch';
import ControlPanelParamsFilterModal from './Modals/ControlPanelParamsFilterModal/ControlPanelParamsFilterModal';
import ControlPanelEditParamModal from './Modals/ControlPanelEditParamModal/ControlPanelEditParamModal';
import ControlPanelShopsTable from './ControlPanelShops/ControlPanelShopsTable/ControlPanelShopsTable';
import ControlPanelShopsSearch from './ControlPanelShops/ControlPanelShopsSearch/ControlPanelShopsSearch';
import ControlPanelShopsFilterModal from './Modals/ControlPanelShopsFilterModal/ControlPanelShopsFilterModal';
import ControlPanelEditShopModal from './Modals/ControlPanelEditShopModal/ControlPanelEditShopModal';

const ControlPanelPage = () => {
  const activeItemId = useAppSelector(
    (state) => state.controlPanel.activeItemId
  );

  const renderTable = () => {
    if (activeItemId === 1) {
      return <ControlPanelUsersTable />;
    } else if (activeItemId === 2) {
      return <ControlPanelTypesTable />;
    } else if (activeItemId === 3) {
      return <ControlPanelProductsTable />;
    } else if (activeItemId === 4) {
      return <ControlPanelCategoriesTable />;
    } else if (activeItemId === 5) {
      return <ControlPanelFeaturesTable />;
    } else if (activeItemId === 6) {
      return <ControlPanelParamsTable />;
    } else if (activeItemId === 7) {
      return <ControlPanelShopsTable />;
    } else {
      return null;
    }
  };

  const renderSearch = () => {
    if (activeItemId === 1) {
      return <ControlPanelUsersSearch />;
    } else if (activeItemId === 2) {
      return <ControlPanelTypesSearch />;
    } else if (activeItemId === 3) {
      return <ControlPanelProductsSearch />;
    } else if (activeItemId === 4) {
      return <ControlPanelCategoriesSearch />;
    } else if (activeItemId === 5) {
      return <ControlPanelFeaturesSearch />;
    } else if (activeItemId === 6) {
      return <ControlPanelParamsSearch />;
    } else if (activeItemId === 7) {
      return <ControlPanelShopsSearch />;
    } else {
      return null;
    }
  };

  return (
    <div className={styles.container}>
      <ControlPanelUsersFilterModal />
      <ControlPanelTypesFilterModal />
      <ControlPanelCategoriesFilterModal />
      <ControlPanelProductsFilterModal />
      <ControlPanelEditUserModal />
      <ControlPanelEditTypeModal />
      <ControlPanelEditProductModal />
      <ControlPanelEditCategoryModal />
      <ControlPanelEditTypeParamsModal />
      <ControlPanelParamsFilterModal />
      <ControlPanelEditParamModal />
      <ControlPanelFeaturesFilterModal />
      <ControlPanelEditFeatureModal />
      <ControlPanelShopsFilterModal />
      <ControlPanelEditShopModal />
      <Navmenu searchRender={() => renderSearch()} />
      <div className={styles.section}>
        <ControlPanelSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default ControlPanelPage;
