import { Button, Loader, Modal, Search } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import TaskDetailMemberItem from './TaskDetailMemberItem/TaskDetailMemberItem';
import { v4 as uuidv4 } from 'uuid';
import { IEmployee } from 'models/api/IEmployee';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { ITaskMember } from 'models/api/ITaskMember';
import { taskSlice } from 'store/reducers/TaskSlice';
import styles from './TaskDetailMembersModal.module.scss';

const TaskDetailMembersModal = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [foundEmployees, setFoundEmployees] = useState<IEmployee[]>([]);
  const [foundTaskMembers, setFoundTaskMembers] = useState<ITaskMember[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const taskMembersModal = useAppSelector(
    (state) => state.modal.taskMembersModal
  );

  const task = useAppSelector((state) => state.task.task);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (taskMembersModal.isShowing) {
      fetchEmployees();
    }
  }, [taskMembersModal.isShowing]);

  useEffect(() => {
    if (taskMembersModal.isShowing && search !== '') {
      searchHandler(search);
    }
  }, [employees, task.taskMembers]);

  const fetchEmployees = () => {
    EmployeeAPI.getAll({ appId: 4 })
      .then((data) => {
        if (task.taskMembers) {
          setEmployees(employeesMinusMembers(data.rows, task.taskMembers));
        } else {
          setEmployees(data.rows);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const employeesMinusMembers = (
    employees: IEmployee[],
    taskMembers: ITaskMember[]
  ) => {
    return employees.filter((employee) => {
      return !taskMembers.find((taskMember) => {
        return employee.id === taskMember.employee.id;
      });
    });
  };

  const addTaskMember = (employee: IEmployee) => {
    const createdTaskMember: ITaskMember = {
      id: uuidv4(),
      employee,
    };
    dispatch(taskSlice.actions.addTaskMember(createdTaskMember));
    setEmployees((prevState) =>
      prevState.filter((state) => state.id !== employee.id)
    );

    dispatch(taskSlice.actions.addTaskMemberForCreate(employee.id));
  };

  const deleteTaskMember = (taskMember: ITaskMember) => {
    dispatch(
      taskSlice.actions.deleteTaskMemberByEmployeeId(taskMember.employee.id)
    );
    setEmployees((prevState) => [...prevState, taskMember.employee]);

    dispatch(
      taskSlice.actions.addTaskMemberForDeleteByEmployeeId(
        taskMember.employee.id
      )
    );
  };

  const addAllTaskMembers = () => {
    const createdTaskMembers: ITaskMember[] = [];
    employees.forEach((employee) => {
      createdTaskMembers.push({
        id: uuidv4(),
        employee,
      });
    });

    const employeeIds: number[] = [];
    employees.forEach((employee) => {
      employeeIds.push(employee.id);
    });
    dispatch(taskSlice.actions.addTaskMembers(createdTaskMembers));
    setEmployees([]);
    dispatch(taskSlice.actions.addTaskMembersForCreate(employeeIds));
  };

  const deleteAllTaskMembers = () => {
    if (!task.taskMembers) return;

    const taskMembers = task.taskMembers;
    const newEmployees: IEmployee[] = [];
    const employeeIds: number[] = [];
    taskMembers.forEach((taskMember) => {
      newEmployees.push(taskMember.employee);
      employeeIds.push(taskMember.employee.id);
    });
    dispatch(taskSlice.actions.deleteTaskMembers());
    setEmployees((prevState) => [...prevState, ...newEmployees]);
    dispatch(
      taskSlice.actions.addTaskMembersForDeleteByEmployeeIds(employeeIds)
    );
  };

  const searchHandler = (value: string) => {
    setSearch(value);

    const lowerCaseValue = value.toLowerCase();
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(lowerCaseValue)
    );
    const filteredTaskMembers = task.taskMembers?.filter((taskMember) =>
      taskMember.employee.name.toLowerCase().includes(lowerCaseValue)
    );

    setFoundEmployees(filteredEmployees);
    setFoundTaskMembers(filteredTaskMembers || []);
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('taskMembersModal'));
    setSearch('');
    setFoundEmployees([]);
    setFoundTaskMembers([]);
    setIsLoading(true);
  };

  return (
    <Modal
      title="Участники"
      isShowing={taskMembersModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {isLoading && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
        <Search
          value={search}
          onChange={searchHandler}
          placeholder="Поиск сотрудников"
          showResults={false}
          className={styles.search}
        />
        <div className={styles.employees_container}>
          <div className={styles.section}>
            <div className={styles.title}>Участвуют в задаче:</div>
            <div className={styles.items_container}>
              <div className={styles.employees}>
                {search !== ''
                  ? foundTaskMembers.map((taskMember) => (
                      <TaskDetailMemberItem
                        employee={taskMember.employee}
                        isAdded={true}
                        onClick={() => deleteTaskMember(taskMember)}
                        key={taskMember.employee.id}
                      />
                    ))
                  : task.taskMembers?.map((taskMember) => (
                      <TaskDetailMemberItem
                        employee={taskMember.employee}
                        isAdded={true}
                        onClick={() => deleteTaskMember(taskMember)}
                        key={taskMember.employee.id}
                      />
                    ))}
              </div>
            </div>
            <Button onClick={deleteAllTaskMembers}>Удалить всех</Button>
          </div>
          <div className={styles.separator} />
          <div className={styles.section}>
            <div className={styles.title}>Не участвуют в задаче:</div>
            <div className={styles.items_container}>
              <div className={styles.employees}>
                {search !== ''
                  ? foundEmployees.map((employee) => (
                      <TaskDetailMemberItem
                        employee={employee}
                        isAdded={false}
                        onClick={() => addTaskMember(employee)}
                        key={employee.id}
                      />
                    ))
                  : employees.map((employee) => (
                      <TaskDetailMemberItem
                        employee={employee}
                        isAdded={false}
                        onClick={() => addTaskMember(employee)}
                        key={employee.id}
                      />
                    ))}
              </div>
            </div>
            <Button onClick={addAllTaskMembers}>Добавить всех</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailMembersModal;
