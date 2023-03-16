import { Navmenu } from 'components';
import TasksFilterModal from './Modals/FilterModal/TasksFilterModal';
import TasksSearch from './Search/TasksSearch';
import TasksSidemenu from './Sidemenu/TasksSidemenu';
import Tasks from './Tasks/Tasks';
import styles from './TasksPage.module.scss';

const TasksPage = () => {
  return (
    <div className={styles.container}>
      <TasksFilterModal />
      <Navmenu searchRender={TasksSearch} />
      <div className={styles.section}>
        <TasksSidemenu />
        <div className={styles.panel}>
          <Tasks />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
