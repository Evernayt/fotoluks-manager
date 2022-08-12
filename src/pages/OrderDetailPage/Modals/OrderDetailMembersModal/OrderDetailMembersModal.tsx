import { Modal } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchUsersAPI } from 'http/userAPI';
import { IUser, UserRoles } from 'models/IUser';
import { IOrderMember } from 'models/IOrderMember';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import OrderDetailMemberItem from './OrderDetailMemberItem/OrderDetailMemberItem';
import { v4 as uuidv4 } from 'uuid';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrderDetailMembersModal.module.css';

const OrderDetailMembersModal = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const orderMembersModal = useAppSelector(
    (state) => state.modal.orderMembersModal
  );

  const order = useAppSelector((state) => state.order.order);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderMembersModal.isShowing) {
      fetchUsers();
    }
  }, [orderMembersModal.isShowing]);

  const fetchUsers = () => {
    fetchUsersAPI(100, 1, [UserRoles.EMPLOYEE, UserRoles.ADMIN]).then(
      (data) => {
        setUsers(usersMinusMembers(data.rows, order.orderMembers));
      }
    );
  };

  const usersMinusMembers = (
    users: IUser[],
    orderMembers: IOrderMember[]
  ): IUser[] => {
    return users.filter((user) => {
      return !orderMembers.find((orderMember) => {
        return user.id === orderMember.user.id;
      });
    });
  };

  const addOrderMember = (user: IUser) => {
    const createdOrderMember: IOrderMember = {
      id: uuidv4(),
      user,
    };
    dispatch(orderSlice.actions.addOrderMember(createdOrderMember));
    setUsers((prevState) => prevState.filter((state) => state.id !== user.id));

    dispatch(orderSlice.actions.addOrderMembersForCreate(createdOrderMember));
  };

  const deleteOrderMember = (orderMember: IOrderMember) => {
    dispatch(orderSlice.actions.deleteOrderMemberByUserId(orderMember.user.id));
    setUsers((prevState) => [...prevState, orderMember.user]);

    dispatch(
      orderSlice.actions.addOrderMembersForDeleteByUserId(orderMember.user.id)
    );
  };

  const close = () => {
    dispatch(modalSlice.actions.closeOrderMembersModal());
  };

  return (
    <Modal
      title="Участники"
      isShowing={orderMembersModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <div className={styles.items_container}>
          {order.orderMembers.map((orderMember) => (
            <OrderDetailMemberItem
              user={orderMember.user}
              isAdded={true}
              clickHandler={() => deleteOrderMember(orderMember)}
              key={orderMember.id}
            />
          ))}
        </div>

        <div
          className={[styles.items_container, styles.items_container_gap].join(
            ' '
          )}
        >
          {users.map((user) => (
            <OrderDetailMemberItem
              user={user}
              isAdded={false}
              clickHandler={() => addOrderMember(user)}
              key={user.id}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailMembersModal;
