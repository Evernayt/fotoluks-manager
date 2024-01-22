import { Loader, Search } from 'components';
import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { mask } from 'node-masker';
import { IUser } from 'models/api/IUser';
import UserAPI from 'api/UserAPI/UserAPI';
import { IconPlus } from '@tabler/icons-react';
import { orderActions } from 'store/reducers/OrderSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import { Avatar, Text } from '@chakra-ui/react';
import { MODES, NOT_INDICATED } from 'constants/app';
import styles from './OrderClientSearch.module.scss';

interface OrderClientSearchProps extends HTMLAttributes<HTMLDivElement> {}

const OrderClientSearch: FC<OrderClientSearchProps> = ({ ...props }) => {
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(true);
    UserAPI.getAll({ search })
      .then((data) => {
        setUsers(data.rows);
      })
      .finally(() => setIsLoading(false));
  };

  const selectUser = (user: IUser) => {
    dispatch(orderActions.setOrderUser(user));
    dispatch(orderActions.setDiscount(user.discount));
    setSearch('');
  };

  const createOnRequest = () => {
    dispatch(
      modalActions.openModal({
        modal: 'orderClientEditModal',
        props: { searchText: search, mode: MODES.ADD_MODE },
      })
    );
    setSearch('');
  };

  const getUserName = (user: IUser) => {
    if (user.name || user.surname || user.patronymic) {
      return `${user.surname} ${user.name} ${user.patronymic}`;
    } else {
      return 'Неизвестный';
    }
  };

  const renderFooter = () => {
    return (
      <div className={styles.result} onClick={createOnRequest}>
        <div className={styles.create_icon}>
          <IconPlus className="primary-icon" />
        </div>
        <Text className={styles.create_btn}>
          Создать по запросу <b>"{search}"</b>
        </Text>
      </div>
    );
  };

  return (
    <Search
      value={search}
      onChange={setSearch}
      placeholder="Поиск клиентов"
      isLoading={isLoading}
      isNotFound={!users.length}
      footer={renderFooter()}
      {...props}
    >
      {users.map((user) => (
        <div
          className={styles.result}
          onClick={() => selectUser(user)}
          key={user.id}
        >
          <Avatar
            name={`${user.name} ${user.surname}`}
            src={user.avatar || undefined}
          />
          <div className={styles.user_container}>
            <Text>{getUserName(user)}</Text>
            <Text fontSize="sm">
              {user.phone
                ? mask(user.phone, '8 (999) 999-99-99')
                : NOT_INDICATED}
            </Text>
          </div>
        </div>
      ))}
    </Search>
  );
};

export default OrderClientSearch;
