import { Search } from 'components';
import { defaultAvatar } from 'constants/images';
import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { searchUsersAPI } from 'http/userAPI';
import { createIcon } from 'icons';
import { IUser } from 'models/IUser';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { mask } from 'node-masker';
import styles from './OrderDetailClientSearch.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import { modalSlice } from 'store/reducers/ModalSlice';

interface OrderDetailClientSearchProps extends HTMLAttributes<HTMLDivElement> {}

const OrderDetailClientSearch: FC<OrderDetailClientSearchProps> = ({
  ...props
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<IUser[]>([]);

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers();
    } else {
      setFoundUsers([]);
    }
  }, [debouncedSearchTerm]);

  const searchUsers = () => {
    searchUsersAPI(15, 1, searchText).then((data) => {
      setFoundUsers(data.rows);
    });
  };

  const selectUser = (user: IUser) => {
    dispatch(orderSlice.actions.setOrderUser(user));
    setSearchText('');
  };

  const createOnRequest = () => {
    dispatch(modalSlice.actions.openUserRegistrationModal(searchText));
    setSearchText('');
  };

  return (
    <Search
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Поиск клиентов"
      resultMaxHeight={300}
      {...props}
    >
      {foundUsers.map((foundUser) => (
        <div
          className={styles.result}
          key={foundUser.id}
          onClick={() => selectUser(foundUser)}
        >
          <img
            className={styles.user_avatar}
            src={foundUser.avatar ? foundUser.avatar : defaultAvatar}
            alt=""
          />
          <div className={styles.user_container}>
            <span className={styles.user_name}>{foundUser.name}</span>
            <span className={styles.user_phone}>
              {foundUser.phone
                ? mask(foundUser.phone, '8 (999) 999-99-99')
                : 'Не указано'}
            </span>
          </div>
        </div>
      ))}
      <div className={styles.result} onClick={createOnRequest}>
        <div className={styles.create_icon}>
          <img src={createIcon} alt="" />
        </div>
        <span className={styles.create_btn}>
          Создать по запросу{' '}
          <span style={{ fontWeight: '500' }}>"{searchText}"</span>
        </span>
      </div>
    </Search>
  );
};

export default OrderDetailClientSearch;
