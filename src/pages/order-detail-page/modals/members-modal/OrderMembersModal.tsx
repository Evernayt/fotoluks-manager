import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IEmployee } from 'models/api/IEmployee';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { IOrderMember } from 'models/api/IOrderMember';
import { orderActions } from 'store/reducers/OrderSlice';
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
import styles from './OrderMembersModal.module.scss';

const OrderMembersModal = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [foundEmployees, setFoundEmployees] = useState<IEmployee[]>([]);
  const [foundOrderMembers, setFoundOrderMembers] = useState<IOrderMember[]>(
    []
  );
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen } = useAppSelector((state) => state.modal.orderMembersModal);
  const order = useAppSelector((state) => state.order.order);

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
  }, [employees, order.orderMembers]);

  const fetchEmployees = () => {
    EmployeeAPI.getAll({ appId: 1 })
      .then((data) => {
        if (order.orderMembers) {
          setEmployees(employeesMinusMembers(data.rows, order.orderMembers));
        } else {
          setEmployees(data.rows);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const employeesMinusMembers = (
    employees: IEmployee[],
    orderMembers: IOrderMember[]
  ) => {
    return employees.filter((employee) => {
      return !orderMembers.find((orderMember) => {
        return employee.id === orderMember.employee.id;
      });
    });
  };

  const addOrderMember = (employee: IEmployee) => {
    const createdOrderMember: IOrderMember = {
      id: uuidv4(),
      employee,
    };
    dispatch(orderActions.addOrderMember(createdOrderMember));
    setEmployees((prevState) =>
      prevState.filter((state) => state.id !== employee.id)
    );

    dispatch(orderActions.addOrderMemberForCreate(createdOrderMember));
  };

  const deleteOrderMember = (orderMember: IOrderMember) => {
    dispatch(
      orderActions.deleteOrderMemberByEmployeeId(orderMember.employee.id)
    );
    setEmployees((prevState) => [...prevState, orderMember.employee]);

    dispatch(
      orderActions.addOrderMemberForDeleteByEmployeeId(orderMember.employee.id)
    );
  };

  const addAllOrderMembers = () => {
    const createdOrderMembers: IOrderMember[] = [];
    for (let i = 0; i < employees.length; i++) {
      createdOrderMembers.push({
        id: uuidv4(),
        employee: employees[i],
      });
    }
    dispatch(orderActions.addOrderMembers(createdOrderMembers));
    setEmployees([]);
    dispatch(orderActions.addOrderMembersForCreate(createdOrderMembers));
  };

  const deleteAllOrderMembers = () => {
    if (!order.orderMembers) return;

    const orderMembers = order.orderMembers;
    const newEmployees: IEmployee[] = [];
    const employeeIds: number[] = [];
    for (let i = 0; i < orderMembers.length; i++) {
      newEmployees.push(orderMembers[i].employee);
      employeeIds.push(orderMembers[i].employee.id);
    }
    dispatch(orderActions.deleteOrderMembers());
    setEmployees((prevState) => [...prevState, ...newEmployees]);
    dispatch(orderActions.addOrderMembersForDeleteByEmployeeIds(employeeIds));
  };

  const searchHandler = (value: string) => {
    setSearch(value);

    const lowerCaseValue = value.toLowerCase();
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(lowerCaseValue)
    );
    const filteredOrderMembers = order.orderMembers?.filter((orderMember) =>
      orderMember.employee.name.toLowerCase().includes(lowerCaseValue)
    );

    setFoundEmployees(filteredEmployees);
    setFoundOrderMembers(filteredOrderMembers || []);
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('orderMembersModal'));
    setSearch('');
    setFoundEmployees([]);
    setFoundOrderMembers([]);
    setIsLoading(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="3xl">
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
                  <Heading size="sm">Участвуют в заказе:</Heading>
                  <div className={styles.items_container}>
                    <div className={styles.employees}>
                      {search !== ''
                        ? foundOrderMembers.map((orderMember) => (
                            <MemberButton
                              employee={orderMember.employee}
                              onClick={() => deleteOrderMember(orderMember)}
                              key={orderMember.employee.id}
                            />
                          ))
                        : order.orderMembers?.map((orderMember) => (
                            <MemberButton
                              employee={orderMember.employee}
                              onClick={() => deleteOrderMember(orderMember)}
                              key={orderMember.employee.id}
                            />
                          ))}
                    </div>
                  </div>
                  <Button minH="35px" onClick={deleteAllOrderMembers}>
                    Удалить всех
                  </Button>
                </div>
                <div>
                  <Divider orientation="vertical" mx={2} />
                </div>
                <div className={styles.section}>
                  <Heading size="sm">Не участвуют в заказе:</Heading>
                  <div className={styles.items_container}>
                    <div className={styles.employees}>
                      {search !== ''
                        ? foundEmployees.map((employee) => (
                            <MemberButton
                              employee={employee}
                              isPlus
                              onClick={() => addOrderMember(employee)}
                              key={employee.id}
                            />
                          ))
                        : employees.map((employee) => (
                            <MemberButton
                              employee={employee}
                              isPlus
                              onClick={() => addOrderMember(employee)}
                              key={employee.id}
                            />
                          ))}
                    </div>
                  </div>
                  <Button minH="35px" onClick={addAllOrderMembers}>
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

export default OrderMembersModal;
