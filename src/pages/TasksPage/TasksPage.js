import { Navmenu } from 'components';

const TasksPage = () => {
  return (
    <div>
      <div className="tasks-container">
        <Navmenu />
        <div className="tasks-section">Tasks</div>
      </div>
    </div>
  );
};

export default TasksPage;
