import TaskAPI from 'api/TaskAPI/TaskAPI';
import { useDebounce } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITasksFilter } from 'models/api/ITask';
import { useEffect, useState } from 'react';
import { filterActions } from 'store/reducers/FilterSlice';
import { taskActions } from 'store/reducers/TaskSlice';
import { Divider, Heading, useToast } from '@chakra-ui/react';
import { Loader } from 'components';
import Pagination from 'components/ui/pagination/Pagination';
import Task from './task/Task';
import TasksToolbar from './TasksToolbar';
import styles from './Tasks.module.scss';

const Tasks = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);

  const tasks = useAppSelector((state) => state.task.tasks);
  const isLoading = useAppSelector((state) => state.task.isLoading);
  const search = useAppSelector((state) => state.task.search);
  const forceUpdate = useAppSelector((state) => state.task.forceUpdate);
  const tasksFilter = useAppSelector((state) => state.filter.tasksFilter);
  const activeStatus = useAppSelector((state) => state.task.activeStatus);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const employee = useAppSelector((state) => state.employee.employee);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    reloadAndChangePage(1);
  }, [activeStatus]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(
        filterActions.setDisableFilter({
          filter: 'tasksFilter',
          isDisabled: true,
        })
      );
      reloadAndChangePage(1);
    } else {
      dispatch(
        filterActions.setDisableFilter({
          filter: 'tasksFilter',
          isDisabled: false,
        })
      );
      reload(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (tasksFilter.isActive) {
      reloadAndChangePage(1);
    } else if (tasksFilter.isPendingDeactivation) {
      dispatch(filterActions.deactiveFilter('tasksFilter'));
      fetchTasks(currentPage, { shopIds: [1, activeShop.id] });
    } else if (forceUpdate) {
      fetchTasks(currentPage, { shopIds: [1, activeShop.id] });
    }
    dispatch(taskActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchTasks = (page: number, filter?: ITasksFilter) => {
    dispatch(taskActions.setIsLoading(true));

    TaskAPI.getAll({
      ...filter,
      limit,
      page,
      status: activeStatus,
      personalEmployeeId: employee?.id,
      search,
    })
      .then((data) => {
        dispatch(taskActions.setTasks(data.rows));
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) =>
        toast({
          title: 'Tasks.fetchTasks',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => dispatch(taskActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    if (tasksFilter.isActive) {
      fetchTasks(page, tasksFilter);
    } else {
      fetchTasks(page, { shopIds: [1, activeShop.id] });
    }
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  return (
    <>
      <TasksToolbar reload={reload} onLimitChange={setLimit} />
      <div className={styles.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {tasks.length ? (
              <div className={styles.tasks}>
                {tasks.map((task) => (
                  <Task task={task} key={task.id} />
                ))}
              </div>
            ) : (
              <Heading className={styles.message} size="md">
                Ничего не найдено
              </Heading>
            )}
          </>
        )}
      </div>
      {!search && pageCount > 1 && (
        <div>
          <Divider />
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={reloadAndChangePage}
          />
        </div>
      )}
    </>
  );
};

export default Tasks;
