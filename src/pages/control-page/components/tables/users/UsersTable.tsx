import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { filterActions } from 'store/reducers/FilterSlice';
import { Row } from '@tanstack/react-table';
import { controlActions } from 'store/reducers/ControlSlice';
import { useContextMenu } from 'react-contexify';
import { IUser, IUsersFilter } from 'models/api/IUser';
import UserAPI from 'api/UserAPI/UserAPI';
import UsersToolbar from './UsersToolbar';
import { usersTableColumns } from './UsersTable.colums';
import UsersContextMenu, {
  USERS_MENU_ID,
} from './context-menu/UsersContextMenu';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import { getErrorToast } from 'helpers/toast';

const UsersTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [users, setUsers] = useState<IUser[]>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const usersFilter = useAppSelector((state) => state.filter.usersFilter);
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: USERS_MENU_ID });

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (usersFilter.isActive) {
      reloadAndChangePage(1);
    } else if (usersFilter.isPendingDeactivation) {
      dispatch(filterActions.deactiveFilter('usersFilter'));
      fetchUsers(currentPage);
    } else if (forceUpdate) {
      fetchUsers(currentPage);
    }
    dispatch(controlActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchUsers = (page: number, filter?: IUsersFilter) => {
    dispatch(controlActions.setIsLoading(true));

    UserAPI.getAll({ ...filter, limit, page, search })
      .then((data) => {
        setUsers(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) => toast(getErrorToast('UsersTable.fetchUsers', e)))
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    if (usersFilter.isActive) {
      fetchUsers(page, usersFilter);
    } else {
      fetchUsers(page);
    }
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IUser>) => {
    dispatch(
      modalActions.openModal({
        modal: 'usersEditModal',
        props: { userId: row.original.id, mode: MODES.EDIT_MODE },
      })
    );
  };

  const handleContextMenu = (row: Row<IUser>, event: any) => {
    show({ event, props: row.original });
  };

  return (
    <>
      <UsersContextMenu />
      <UsersToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={usersTableColumns}
        data={users}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default UsersTable;
