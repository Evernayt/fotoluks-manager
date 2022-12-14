import { IconButton, Loader, Modal } from 'components';
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
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { IconMinus, IconPlus } from 'icons';

const OrderDetailMembersModal = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const orderMembersModal = useAppSelector(
    (state) => state.modal.orderMembersModal
  );

  const order = useAppSelector((state) => state.order.order);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderMembersModal.isShowing) {
      fetchShops();
      fetchUsers();
    }
  }, [orderMembersModal.isShowing]);

  const fetchShops = () => {
    fetchShopsAPI(100, 1, true).then((data) => {
      setShops(data.rows);
    });
  };

  const fetchUsers = () => {
    fetchUsersAPI(100, 1, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
      .then((data) => {
        setUsers(usersMinusMembers(data.rows, order.orderMembers));
      })
      .finally(() => setIsLoading(false));
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

    dispatch(orderSlice.actions.addOrderMemberForCreate(createdOrderMember));
  };

  const deleteOrderMember = (orderMember: IOrderMember) => {
    dispatch(orderSlice.actions.deleteOrderMemberByUserId(orderMember.user.id));
    setUsers((prevState) => [...prevState, orderMember.user]);

    dispatch(
      orderSlice.actions.addOrderMemberForDeleteByUserId(orderMember.user.id)
    );
  };

  const addAllOrderMembers = (shopId: number) => {
    const foundUsers = users.filter((user) => user.shopId === shopId);

    const createdOrderMembers: IOrderMember[] = [];
    for (let i = 0; i < foundUsers.length; i++) {
      createdOrderMembers.push({
        id: uuidv4(),
        user: foundUsers[i],
      });
    }

    dispatch(orderSlice.actions.addOrderMembers(createdOrderMembers));
    setUsers((prevState) =>
      prevState.filter((state) => state.shopId !== shopId)
    );

    dispatch(orderSlice.actions.addOrderMembersForCreate(createdOrderMembers));
  };

  const deleteAllOrderMembers = (shopId: number) => {
    const foundOrderMembers = order.orderMembers.filter(
      (orderMember) => orderMember.user.shopId === shopId
    );

    const foundUsers: IUser[] = [];
    const userIds: number[] = [];
    for (let i = 0; i < foundOrderMembers.length; i++) {
      foundUsers.push(foundOrderMembers[i].user);
      userIds.push(foundOrderMembers[i].user.id);
    }

    dispatch(orderSlice.actions.deleteOrderMembersByShopId(shopId));
    setUsers((prevState) => [...prevState, ...foundUsers]);

    dispatch(orderSlice.actions.addOrderMembersForDeleteByUserId(userIds));
  };

  const close = () => {
    dispatch(modalSlice.actions.closeOrderMembersModal());
  };

  return (
    <Modal
      title="??????????????????"
      isShowing={orderMembersModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {isLoading && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
        <div className={styles.section}>
          <div className={styles.title}>?????????????????? ?? ????????????:</div>
          <div className={styles.shops_container}>
            {shops.map((shop) => (
              <div key={shop.id}>
                <div className={styles.shop_item}>
                  {shop.name}
                  <IconButton
                    style={{
                      minHeight: '32px',
                      padding: '4px',
                    }}
                    icon={<IconMinus className="secondary-icon" />}
                    onClick={() => deleteAllOrderMembers(shop.id)}
                  />
                </div>
                <div className={styles.items_container}>
                  {order.orderMembers.map((orderMember) => {
                    if (orderMember.user.shopId === shop.id) {
                      return (
                        <OrderDetailMemberItem
                          user={orderMember.user}
                          isAdded={true}
                          clickHandler={() => deleteOrderMember(orderMember)}
                          key={orderMember.user.id}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.separator} />
        <div className={styles.section}>
          <div className={styles.title}>???? ?????????????????? ?? ????????????:</div>
          <div className={styles.shops_container}>
            {shops.map((shop) => (
              <div key={shop.id}>
                <div className={styles.shop_item}>
                  {shop.name}
                  <IconButton
                    style={{
                      minHeight: '32px',
                      padding: '4px',
                    }}
                    icon={<IconPlus className="secondary-icon" />}
                    onClick={() => addAllOrderMembers(shop.id)}
                  />
                </div>
                <div className={styles.items_container}>
                  {users.map((user) => {
                    if (user.shopId === shop.id) {
                      return (
                        <OrderDetailMemberItem
                          user={user}
                          isAdded={false}
                          clickHandler={() => addOrderMember(user)}
                          key={user.id}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailMembersModal;
