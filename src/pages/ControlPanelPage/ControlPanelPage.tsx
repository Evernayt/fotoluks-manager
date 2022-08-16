import { Navmenu } from 'components';
import ControlPanelSidemenu from './ControlPanelSidemenu/ControlPanelSidemenu';
import ControlPanelUsersTable from './ControlPanelUsersTable/ControlPanelUsersTable';
import { useAppSelector } from 'hooks/redux';
import ControlPanelUsersFilterModal from './Modals/ControlPanelUsersFilterModal/ControlPanelUsersFilterModal';
import ControlPanelUsersSearch from './ControlPanelUsersSearch/ControlPanelUsersSearch';
import styles from './ControlPanelPage.module.css';
import ControlPanelEditUserModal from './Modals/ControlPanelEditUserModal/ControlPanelEditUserModal';
import ControlPanelTypesTable from './ControlPanelTypesTable/ControlPanelTypesTable';
import ControlPanelTypesSearch from './ControlPanelTypesSearch/ControlPanelTypesSearch';
import ControlPanelTypesFilterModal from './Modals/ControlPanelTypesFilterModal/ControlPanelTypesFilterModal';
import ControlPanelEditTypeModal from './Modals/ControlPanelEditTypeModal/ControlPanelEditTypeModal';
import ControlPanelEditProductModal from './Modals/ControlPanelEditProductModal/ControlPanelEditProductModal';
import ControlPanelEditCategoryModal from './Modals/ControlPanelEditCategoryModal/ControlPanelEditCategoryModal';
import ControlPanelEditParamsModal from './Modals/ControlPanelEditParamsModal/ControlPanelEditParamsModal';

const ControlPanelPage = () => {
  const activeItemId = useAppSelector(
    (state) => state.controlPanel.activeItemId
  );

  const renderTable = () => {
    if (activeItemId === 1) {
      return <ControlPanelUsersTable />;
    } else if (activeItemId === 2) {
      return <ControlPanelTypesTable />;
    } else {
      return null;
    }
  };

  const renderSearch = () => {
    if (activeItemId === 1) {
      return <ControlPanelUsersSearch />;
    } else if (activeItemId === 2) {
      return <ControlPanelTypesSearch />;
    } else {
      return null;
    }
  };

  return (
    <div className={styles.container}>
      <ControlPanelEditUserModal />
      <ControlPanelUsersFilterModal />
      <ControlPanelEditTypeModal />
      <ControlPanelTypesFilterModal />
      <ControlPanelEditProductModal />
      <ControlPanelEditCategoryModal />
      <ControlPanelEditParamsModal />
      <Navmenu searchRender={() => renderSearch()} />
      <div className={styles.section}>
        <ControlPanelSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default ControlPanelPage;
