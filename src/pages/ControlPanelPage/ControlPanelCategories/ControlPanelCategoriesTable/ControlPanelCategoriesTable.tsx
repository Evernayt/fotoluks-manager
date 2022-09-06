import { Loader } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row, useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import { ICategory } from 'models/ICategory';
import { fetchCategoriesAPI } from 'http/categoryAPI';
import styles from './ControlPanelCategoriesTable.module.css';
import ControlPanelCategoriesToolbar from './ControlPanelCategoriesToolbar/ControlPanelCategoriesToolbar';
import CategoryMenuCell from './CategoryMenuCell';

const ControlPanelCategoriesTable = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const categoriesFilter = useAppSelector(
    (state) => state.controlPanel.categoriesFilter
  );
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const foundCategories = useAppSelector(
    (state) => state.controlPanel.foundCategories
  );

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Наименование',
        accessor: 'name',
        style: { width: '100%' },
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: CategoryMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
    if (foundCategories.categoryData.rows.length === 0) {
      if (foundCategories.searchText === '') {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        setIsNotFound(false);
      } else {
        setPageCount(1);
        setIsNotFound(true);
      }
    } else {
      setCategories(foundCategories.categoryData.rows);
      const count = Math.ceil(foundCategories.categoryData.count / limit);
      setPageCount(count);
      setIsNotFound(false);
    }
  }, [foundCategories]);

  useEffect(() => {
    if (categoriesFilter.filter.isActive) {
      fetchWithFilters();
    } else if (categoriesFilter.filter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveCategoriesFilter());
      fetchCategories(page);
    } else if (forceUpdate) {
      fetchCategories(page);
    }

    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchCategories = (page: number, archive?: boolean) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    fetchCategoriesAPI(limit, page, archive)
      .then((data) => {
        setCategories(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const fetchWithFilters = () => {
    const { archive } = categoriesFilter;

    fetchCategories(page, archive);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const reload = (page: number = 1) => {
    if (categoriesFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchCategories(page);
    }
  };

  const rowClickHandler = (row: Row<ICategory>) => {
    dispatch(
      modalSlice.actions.openControlPanelEditCategoryModal({
        categoryId: row.values.id,
        mode: Modes.EDIT_MODE,
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: categories });

  return (
    <div style={{ height: '100%' }}>
      <ControlPanelCategoriesToolbar
        setLimit={setLimit}
        reload={() => reload()}
      />
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

export default ControlPanelCategoriesTable;
