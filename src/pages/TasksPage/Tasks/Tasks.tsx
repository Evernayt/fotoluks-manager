import TaskAPI from 'api/TaskAPI/TaskAPI';
import { Loader, Pagination } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { useDebounce } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITasksFilter } from 'models/api/ITask';
import { useEffect, useState } from 'react';
import { taskSlice } from 'store/reducers/TaskSlice';
import Task from '../Task/Task';
import TasksToolbar from '../Toolbar/TasksToolbar';
import styles from './Tasks.module.scss';
import { accessCheck } from 'helpers';

const Tasks = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);

  const tasks = useAppSelector((state) => state.task.tasks);
  const isLoading = useAppSelector((state) => state.task.isLoading);
  const filter = useAppSelector((state) => state.task.filter);
  const search = useAppSelector((state) => state.task.search);
  const forceUpdate = useAppSelector((state) => state.task.forceUpdate);
  const activeStatus = useAppSelector((state) => state.task.activeStatus);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const employee = useAppSelector((state) => state.employee.employee);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  useEffect(() => {
    pageChangeHandler(1);
  }, [activeStatus]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(taskSlice.actions.setDisableFilter(true));
      fetchTasks(page, { search });
    } else {
      dispatch(taskSlice.actions.setDisableFilter(false));
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (filter.isActive) {
      fetchTasks(page, filter);
    } else if (filter.isPendingDeactivation) {
      dispatch(taskSlice.actions.deactiveFilter());
      fetchTasks(page, { shopIds: [1, activeShop.id] });
    } else if (forceUpdate) {
      fetchTasks(page, { shopIds: [1, activeShop.id] });
    }
    dispatch(taskSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchTasks = (page: number, filter?: ITasksFilter) => {
    dispatch(taskSlice.actions.setIsLoading(true));

    TaskAPI.getAll({
      employeeId: accessCheck(employee, 1) ? undefined : employee?.id,
      ...filter,
      limit,
      page,
      status: activeStatus,
    })
      .then((data) => {
        dispatch(taskSlice.actions.setTasks(data.rows));
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) =>
        showGlobalMessage(e.response.data ? e.response.data.message : e.message)
      )
      .finally(() => dispatch(taskSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (filter.isActive) {
      fetchTasks(page, filter);
    } else {
      fetchTasks(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  return (
    <>
      <TasksToolbar reload={() => reload(page)} onLimitChange={setLimit} />
      {isLoading ? (
        <Loader height="calc(100vh - 200px)" />
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className={styles.message}>Ничего не найдено</div>
          ) : (
            <div className={styles.tasks}>
              {tasks.map((task) => (
                <Task task={task} key={task.id} />
              ))}
            </div>
          )}
        </>
      )}
      {pageCount > 0 && (
        <div className={styles.pagination}>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={pageChangeHandler}
          />
        </div>
      )}
    </>
  );
};

export default Tasks;
