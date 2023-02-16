import { Search } from 'components';
import { defaultAvatar } from 'constants/images';
import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { IconPlus } from 'icons';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { mask } from 'node-masker';
import { orderSlice } from 'store/reducers/OrderSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { IUser } from 'models/api/IUser';
import UserAPI from 'api/UserAPI/UserAPI';
import styles from './OrderDetailClientSearch.module.scss';

interface OrderDetailClientSearchProps extends HTMLAttributes<HTMLDivElement> {}

const OrderDetailClientSearch: FC<OrderDetailClientSearchProps> = ({
  ...props
}) => {
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<IUser[]>([]);

  const debouncedSearchTerm = useDebounce(search);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedSearchTerm]);

  const fetchUsers = () => {
    UserAPI.getAll({ search }).then((data) => {
      setUsers(data.rows);
    });
  };

  const selectUser = (user: IUser) => {
    dispatch(orderSlice.actions.setOrderUser(user));
    setSearch('');
  };

  const createOnRequest = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'userRegistrationModal',
        props: { text: search },
      })
    );
    setSearch('');
  };

  return (
    <Search
      value={search}
      onChange={setSearch}
      placeholder="Поиск клиентов"
      {...props}
    >
      {users.map((user) => (
        <div
          className={styles.result}
          onClick={() => selectUser(user)}
          key={user.id}
        >
          <img
            className={styles.user_avatar}
            src={user.avatar ? user.avatar : defaultAvatar}
            alt=""
          />
          <div className={styles.user_container}>
            <span className={styles.user_name}>{user.name}</span>
            <span className={styles.user_phone}>
              {user.phone
                ? mask(user.phone, '8 (999) 999-99-99')
                : 'Не указано'}
            </span>
          </div>
        </div>
      ))}
      <div className={styles.result} onClick={createOnRequest}>
        <div className={styles.create_icon}>
          <IconPlus className="primary-icon" />
        </div>
        <span className={styles.create_btn}>
          Создать по запросу{' '}
          <span style={{ fontWeight: '500' }}>"{search}"</span>
        </span>
      </div>
    </Search>
  );
};

export default OrderDetailClientSearch;
