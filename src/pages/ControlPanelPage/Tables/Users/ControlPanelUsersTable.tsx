import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ControlPanelUsersToolbar from './Toolbar/ControlPanelUsersToolbar';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { IUser, IUsersFilter } from 'models/api/IUser';
import { useDebounce } from 'hooks';
import UserAPI from 'api/UserAPI/UserAPI';
import { Modes } from 'constants/app';
import UsersContextMenu, {
  USERS_MENU_ID,
} from './ContextMenu/UsersContextMenu';
import { useContextMenu } from 'react-contexify';

const ControlPanelUsersTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [users, setUsers] = useState<IUser[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const usersFilter = useAppSelector((state) => state.controlPanel.usersFilter);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Имя',
        accessor: 'name',
        style: { width: '100%' },
      },
      {
        Header: 'Телефон',
        accessor: 'phone',
      },
      {
        Header: 'Почта',
        accessor: 'email',
      },
      {
        Header: 'ВКонтакте',
        accessor: 'vk',
      },
      {
        Header: 'Telegram',
        accessor: 'telegram',
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchUsers(page, { ...usersFilter, search });
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (usersFilter.isActive) {
      fetchUsers(page, usersFilter);
    } else if (usersFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('usersFilter'));
      fetchUsers(page);
    } else if (forceUpdate) {
      fetchUsers(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const { show } = useContextMenu({ id: USERS_MENU_ID });

  const handleContextMenu = (row: Row<IUser>, event: any) => {
    show({ event, props: { row } });
  };

  const fetchUsers = (page: number, filter?: IUsersFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    UserAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setUsers(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (usersFilter.isActive) {
      fetchUsers(page, usersFilter);
    } else {
      fetchUsers(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IUser>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditUserModal',
        props: { userId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <UsersContextMenu />
      <ControlPanelUsersToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ControlPanelUsersTable;
