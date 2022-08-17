import { Loader } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row, useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ControlPanelTypesToolbar from './ControlPanelProductsToolbar/ControlPanelProductsToolbar';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelProductsTable.module.css';
import { Modes } from 'constants/app';
import { IProduct } from 'models/IProduct';
import { fetchProductsAPI } from 'http/productAPI';
import ControlPanelProductsToolbar from './ControlPanelProductsToolbar/ControlPanelProductsToolbar';

const ControlPanelProductsTable = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const productsFilter = useAppSelector(
    (state) => state.controlPanel.productsFilter
  );
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const foundProducts = useAppSelector(
    (state) => state.controlPanel.foundProducts
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
      },
      {
        Header: 'Наименование (во мн. ч.)',
        accessor: 'pluralName',
      },
      {
        Header: 'Описание',
        accessor: 'description',
        style: { width: '100%' },
      },
      {
        Header: 'Категория',
        accessor: 'category.name',
      },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
    if (foundProducts.productData.rows.length === 0) {
      if (foundProducts.searchText === '') {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        setIsNotFound(false);
      } else {
        setPageCount(1);
        setIsNotFound(true);
      }
    } else {
      setProducts(foundProducts.productData.rows);
      const count = Math.ceil(foundProducts.productData.count / limit);
      setPageCount(count);
      setIsNotFound(false);
    }
  }, [foundProducts]);

  useEffect(() => {
    if (productsFilter.filter.isActive) {
      //const { role } = usersFilter;
      //fetchCategories(page, role.role);
    } else if (productsFilter.filter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveProductsFilter());
      fetchProducts(page);
    } else if (forceUpdate) {
      fetchProducts(page);
    }

    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchProducts = (page: number) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    fetchProductsAPI(limit, page)
      .then((data) => {
        setProducts(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const reload = (page: number = 1) => {
    if (productsFilter.filter.isActive) {
      // const { role } = usersFilter;
      // fetchUsers(page, role.role);
    } else {
      fetchProducts(page);
    }
  };

  const rowClickHandler = (row: Row<IProduct>) => {
    dispatch(
      modalSlice.actions.openControlPanelEditProductModal({
        productId: row.values.id,
        mode: Modes.EDIT_MODE,
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: products });

  return (
    <div style={{ height: '100%' }}>
      <ControlPanelProductsToolbar
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

export default ControlPanelProductsTable;
