import { Loader } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row, useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ControlPanelUsersToolbar from './ControlPanelUsersToolbar/ControlPanelUsersToolbar';
import { fetchUsersAPI } from 'http/userAPI';
import { IUser, UserRoles } from 'models/IUser';
import styles from './ControlPanelUsersTable.module.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import UserMenuCell from './UserMenuCell';
import { Modes } from 'constants/app';

const ControlPanelUsersTable = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const usersFilter = useAppSelector((state) => state.controlPanel.usersFilter);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const foundUsers = useAppSelector((state) => state.controlPanel.foundUsers);

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
        Header: 'Логин',
        accessor: 'login',
      },
      {
        Header: 'Роль',
        accessor: 'role',
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
      {
        Header: 'Филиал',
        accessor: 'shop.name',
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: UserMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
    if (foundUsers.userData.rows.length === 0) {
      if (foundUsers.searchText === '') {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        setIsNotFound(false);
      } else {
        setPageCount(1);
        setIsNotFound(true);
      }
    } else {
      setUsers(foundUsers.userData.rows);
      const count = Math.ceil(foundUsers.userData.count / limit);
      setPageCount(count);
      setIsNotFound(false);
    }
  }, [foundUsers]);

  useEffect(() => {
    if (usersFilter.filter.isActive) {
      fetchWithFilters();
    } else if (usersFilter.filter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveUsersFilter());
      fetchUsers(page);
    } else if (forceUpdate) {
      fetchUsers(page);
    }

    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchUsers = (
    page: number,
    roles?: UserRoles[],
    shopId?: number,
    archive?: boolean
  ) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));
    fetchUsersAPI(limit, page, roles, shopId, archive)
      .then((data) => {
        setUsers(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const fetchWithFilters = () => {
    const { userRole, shopId, archive } = usersFilter;

    if (userRole.role) {
      fetchUsers(page, [userRole.role], shopId, archive);
    } else {
      fetchUsers(page, [], shopId, archive);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const reload = (page: number = 1) => {
    if (usersFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchUsers(page);
    }
  };

  const rowClickHandler = (row: Row<IUser>) => {
    dispatch(
      modalSlice.actions.openControlPanelEditUserModal({
        isShowing: true,
        userId: row.values.id,
        mode: Modes.EDIT_MODE,
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: users });

  return (
    <div style={{ height: '100%' }}>
      <ControlPanelUsersToolbar setLimit={setLimit} reload={() => reload()} />
      {isNotFound ? (
        <div className={[styles.container, styles.message].join(' ')}>
          Ничего не найдено
        </div>
      ) : (
        <div className={styles.container}>
          {isLoading ? (
            <Loader height="calc(100vh - 200px)" />
          ) : (
            <table {...getTableProps()} className={styles.section}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                      <th
                        {...column.getHeaderProps()}
                        className={styles.column}
                        style={column.style}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={styles.row}
                      onClick={(e: any) =>
                        e.target.tagName === 'TD' && rowClickHandler(row)
                      }
                    >
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className={styles.cell}
                          style={cell.column.style}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      <div className={styles.pagination}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Вперед"
          onPageChange={(e) => pageChangeHandler(e.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="Назад"
          renderOnZeroPageCount={() => {}}
          containerClassName="pagination-container"
          pageLinkClassName="pagination-page"
          activeLinkClassName="pagination-active"
          previousLinkClassName="pagination-previous-next"
          nextLinkClassName="pagination-previous-next"
          disabledLinkClassName="pagination-disabled"
          breakLinkClassName="pagination-break"
          forcePage={page - 1}
        />
      </div>
    </div>
  );
};

export default ControlPanelUsersTable;
