import { Navmenu } from 'components';
import styles from './MoyskladPage.module.scss';
import MoyskladSidemenu from './Sidemenu/MoyskladSidemenu';
import { MoyskladMovesTable } from './Tables';

const MoyskladPage = () => {
  return (
    <div className={styles.container}>
      <Navmenu />
      <div className={styles.section}>
        <MoyskladSidemenu />
        <div className={styles.panel}>
          <MoyskladMovesTable />
        </div>
      </div>
    </div>
  );
};

export default MoyskladPage;
