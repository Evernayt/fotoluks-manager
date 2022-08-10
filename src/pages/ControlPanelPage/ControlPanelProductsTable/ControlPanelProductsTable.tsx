import { Loader } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row, useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ControlPanelProductsToolbar from './ControlPanelProductsToolbar/ControlPanelProductsToolbar';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { ICategory } from 'models/ICategory';
import styles from './ControlPanelProductsTable.module.css';
import { fetchCategoriesAPI } from 'http/categoryAPI';

const ControlPanelProductsTable = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const categoriesFilter = useAppSelector((state) => state.controlPanel.categoriesFilter);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  //const foundUsers = useAppSelector((state) => state.controlPanel.foundUsers);

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Категория',
        accessor: 'name',
        style: { width: '100%' },
      },
      {
        Header: 'Продукт',
        accessor: 'login',
      },
      // {
      //   Header: 'Пароль',
      //   accessor: 'password',
      // },
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
    ],
    []
  );

  // useEffect(() => {
  //   setPage(1);
  //   if (foundUsers.userData.rows.length === 0) {
  //     if (foundUsers.searchText === '') {
  //       dispatch(controlPanelSlice.actions.setForceUpdate(true));
  //       setIsNotFound(false);
  //     } else {
  //       setPageCount(1);
  //       setIsNotFound(true);
  //     }
  //   } else {
  //     setUsers(foundUsers.userData.rows);
  //     const count = Math.ceil(foundUsers.userData.count / limit);
  //     setPageCount(count);
  //     setIsNotFound(false);
  //   }
  // }, [foundUsers]);

  useEffect(() => {
    if (categoriesFilter.filter.isActive) {
      //const { role } = usersFilter;
      //fetchCategories(page, role.role);
    } else if (categoriesFilter.filter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveCategoriesFilter());
      fetchCategories(page);
    } else if (forceUpdate) {
      fetchCategories(page);
    }

    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchCategories = (page: number) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    fetchCategoriesAPI(limit, page)
      .then((data) => {
        setCategories(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload();
  };

  const reload = () => {
    if (categoriesFilter.filter.isActive) {
      // const { role } = usersFilter;
      // fetchUsers(page, role.role);
    } else {
      fetchCategories(page);
    }
  };

  const rowClickHandler = (row: Row<ICategory>) => {
    // dispatch(
    //   modalSlice.actions.openControlPanelEditUserModal(row.values.phone)
    // );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: categories });

  return (
    <div style={{ height: '100%' }}>
      <ControlPanelProductsToolbar setLimit={setLimit} reload={reload} />
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

export default ControlPanelProductsTable;
