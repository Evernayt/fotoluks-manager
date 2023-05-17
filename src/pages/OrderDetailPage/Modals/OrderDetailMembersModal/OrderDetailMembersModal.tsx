import { Button, Loader, Modal, Search } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import OrderDetailMemberItem from './OrderDetailMemberItem/OrderDetailMemberItem';
import { v4 as uuidv4 } from 'uuid';
import { orderSlice } from 'store/reducers/OrderSlice';
import { IEmployee } from 'models/api/IEmployee';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { IOrderMember } from 'models/api/IOrderMember';
import styles from './OrderDetailMembersModal.module.scss';

const OrderDetailMembersModal = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [foundEmployees, setFoundEmployees] = useState<IEmployee[]>([]);
  const [foundOrderMembers, setFoundOrderMembers] = useState<IOrderMember[]>(
    []
  );
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const orderMembersModal = useAppSelector(
    (state) => state.modal.orderMembersModal
  );

  const order = useAppSelector((state) => state.order.order);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderMembersModal.isShowing) {
      fetchEmployees();
    }
  }, [orderMembersModal.isShowing]);

  useEffect(() => {
    if (orderMembersModal.isShowing && search !== '') {
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
    dispatch(orderSlice.actions.addOrderMember(createdOrderMember));
    setEmployees((prevState) =>
      prevState.filter((state) => state.id !== employee.id)
    );

    dispatch(orderSlice.actions.addOrderMemberForCreate(createdOrderMember));
  };

  const deleteOrderMember = (orderMember: IOrderMember) => {
    dispatch(
      orderSlice.actions.deleteOrderMemberByEmployeeId(orderMember.employee.id)
    );
    setEmployees((prevState) => [...prevState, orderMember.employee]);

    dispatch(
      orderSlice.actions.addOrderMemberForDeleteByEmployeeId(
        orderMember.employee.id
      )
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
    dispatch(orderSlice.actions.addOrderMembers(createdOrderMembers));
    setEmployees([]);
    dispatch(orderSlice.actions.addOrderMembersForCreate(createdOrderMembers));
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
    dispatch(orderSlice.actions.deleteOrderMembers());
    setEmployees((prevState) => [...prevState, ...newEmployees]);
    dispatch(
      orderSlice.actions.addOrderMembersForDeleteByEmployeeIds(employeeIds)
    );
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

  const close = () => {
    dispatch(modalSlice.actions.closeModal('orderMembersModal'));
    setSearch('');
    setFoundEmployees([]);
    setFoundOrderMembers([]);
    setIsLoading(true);
  };

  return (
    <Modal
      title="Участники"
      isShowing={orderMembersModal.isShowing}
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
            <div className={styles.title}>Участвуют в заказе:</div>
            <div className={styles.items_container}>
              <div className={styles.employees}>
                {search !== ''
                  ? foundOrderMembers.map((orderMember) => (
                      <OrderDetailMemberItem
                        employee={orderMember.employee}
                        isAdded={true}
                        onClick={() => deleteOrderMember(orderMember)}
                        key={orderMember.employee.id}
                      />
                    ))
                  : order.orderMembers?.map((orderMember) => (
                      <OrderDetailMemberItem
                        employee={orderMember.employee}
                        isAdded={true}
                        onClick={() => deleteOrderMember(orderMember)}
                        key={orderMember.employee.id}
                      />
                    ))}
              </div>
            </div>
            <Button onClick={deleteAllOrderMembers}>Удалить всех</Button>
          </div>
          <div className={styles.separator} />
          <div className={styles.section}>
            <div className={styles.title}>Не участвуют в заказе:</div>
            <div className={styles.items_container}>
              <div className={styles.employees}>
                {search !== ''
                  ? foundEmployees.map((employee) => (
                      <OrderDetailMemberItem
                        employee={employee}
                        isAdded={false}
                        onClick={() => addOrderMember(employee)}
                        key={employee.id}
                      />
                    ))
                  : employees.map((employee) => (
                      <OrderDetailMemberItem
                        employee={employee}
                        isAdded={false}
                        onClick={() => addOrderMember(employee)}
                        key={employee.id}
                      />
                    ))}
              </div>
            </div>
            <Button onClick={addAllOrderMembers}>Добавить всех</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailMembersModal;
