import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IEmployee } from 'models/api/IEmployee';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { modalActions } from 'store/reducers/ModalSlice';
import {
  Button,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { MemberButton, Search } from 'components';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { ITaskMember } from 'models/api/ITaskMember';
import { taskActions } from 'store/reducers/TaskSlice';
import styles from './TaskMembersModal.module.scss';

const TaskMembersModal = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [foundEmployees, setFoundEmployees] = useState<IEmployee[]>([]);
  const [foundTaskMembers, setFoundTaskMembers] = useState<ITaskMember[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen } = useAppSelector((state) => state.modal.taskMembersModal);
  const task = useAppSelector((state) => state.task.task);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && search !== '') {
      searchHandler(search);
    }
  }, [employees, task.taskMembers]);

  const fetchEmployees = () => {
    EmployeeAPI.getAll({ appId: 1 })
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
    dispatch(taskActions.addTaskMember(createdTaskMember));
    setEmployees((prevState) =>
      prevState.filter((state) => state.id !== employee.id)
    );

    dispatch(taskActions.addTaskMemberForCreateByEmployeeId(employee.id));
  };

  const deleteTaskMember = (taskMember: ITaskMember) => {
    dispatch(taskActions.deleteTaskMemberByEmployeeId(taskMember.employee.id));
    setEmployees((prevState) => [...prevState, taskMember.employee]);

    dispatch(
      taskActions.addTaskMemberForDeleteByEmployeeId(taskMember.employee.id)
    );
  };

  const addAllTaskMembers = () => {
    const createdTaskMembers: ITaskMember[] = [];
    for (let i = 0; i < employees.length; i++) {
      createdTaskMembers.push({
        id: uuidv4(),
        employee: employees[i],
      });
    }

    const employeeIds: number[] = [];
    employees.forEach((employee) => {
      employeeIds.push(employee.id);
    });
    dispatch(taskActions.addTaskMembers(createdTaskMembers));
    setEmployees([]);
    dispatch(taskActions.addTaskMembersForCreateByEmployeeIds(employeeIds));
  };

  const deleteAllTaskMembers = () => {
    if (!task.taskMembers) return;

    const taskMembers = task.taskMembers;
    const newEmployees: IEmployee[] = [];
    const employeeIds: number[] = [];
    for (let i = 0; i < taskMembers.length; i++) {
      newEmployees.push(taskMembers[i].employee);
      employeeIds.push(taskMembers[i].employee.id);
    }
    dispatch(taskActions.deleteTaskMembers());
    setEmployees((prevState) => [...prevState, ...newEmployees]);
    dispatch(taskActions.addTaskMembersForDeleteByEmployeeIds(employeeIds));
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

  const closeModal = () => {
    dispatch(modalActions.closeModal('taskMembersModal'));
    setSearch('');
    setFoundEmployees([]);
    setFoundTaskMembers([]);
    setIsLoading(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Участники</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoaderWrapper isLoading={isLoading}>
            <div className={styles.container}>
              <Search
                className={styles.search}
                value={search}
                onChange={searchHandler}
                placeholder="Поиск сотрудников"
                showResults={false}
              />
              <div className={styles.employees_container}>
                <div className={styles.section}>
                  <Heading size="sm">Участвуют в задаче:</Heading>
                  <div className={styles.items_container}>
                    <div className={styles.employees}>
                      {search !== ''
                        ? foundTaskMembers.map((taskMember) => (
                            <MemberButton
                              employee={taskMember.employee}
                              onClick={() => deleteTaskMember(taskMember)}
                              key={taskMember.employee.id}
                            />
                          ))
                        : task.taskMembers?.map((taskMember) => (
                            <MemberButton
                              employee={taskMember.employee}
                              onClick={() => deleteTaskMember(taskMember)}
                              key={taskMember.employee.id}
                            />
                          ))}
                    </div>
                  </div>
                  <Button minH="35px" onClick={deleteAllTaskMembers}>
                    Удалить всех
                  </Button>
                </div>
                <div>
                  <Divider orientation="vertical" mx={2} />
                </div>
                <div className={styles.section}>
                  <Heading size="sm">Не участвуют в задаче:</Heading>
                  <div className={styles.items_container}>
                    <div className={styles.employees}>
                      {search !== ''
                        ? foundEmployees.map((employee) => (
                            <MemberButton
                              employee={employee}
                              isPlus
                              onClick={() => addTaskMember(employee)}
                              key={employee.id}
                            />
                          ))
                        : employees.map((employee) => (
                            <MemberButton
                              employee={employee}
                              isPlus
                              onClick={() => addTaskMember(employee)}
                              key={employee.id}
                            />
                          ))}
                    </div>
                  </div>
                  <Button minH="35px" onClick={addAllTaskMembers}>
                    Добавить всех
                  </Button>
                </div>
              </div>
            </div>
          </LoaderWrapper>
        </ModalBody>
        <ModalFooter>
          <Button w="100%" onClick={closeModal}>
            Подтвердить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskMembersModal;
