import { Card } from '@chakra-ui/react';
import TasksSidebar from './components/TasksSidebar';
import Tasks from './components/tasks/Tasks';
import TasksFilterModal from './modals/filter-modal/TasksFilterModal';
import styles from './TasksPage.module.scss';

const TasksPage = () => {
  return (
    <div className={styles.container}>
      <TasksFilterModal />
      <TasksSidebar />
      <Card className={styles.panel}>
        <Tasks />
      </Card>
    </div>
  );
};

export default TasksPage;
