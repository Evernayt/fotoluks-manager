import { Loader } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row, useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import styles from './ControlPanelParamsTable.module.css';
import ParamsMenuCell from './ParamsMenuCell';
import ControlPanelParamsToolbar from './ControlPanelParamsToolbar/ControlPanelParamsToolbar';
import { IParam } from 'models/IParam';
import { fetchParamsAPI } from 'http/paramAPI';

const ControlPanelParamsTable = () => {
  const [params, setParams] = useState<IParam[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const paramsFilter = useAppSelector(
    (state) => state.controlPanel.paramsFilter
  );
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const foundParams = useAppSelector((state) => state.controlPanel.foundParams);

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
        Header: 'Значение',
        accessor: 'value',
      },
      {
        Header: 'Характеристика',
        accessor: 'feature.name',
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: ParamsMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
    if (foundParams.paramData.rows.length === 0) {
      if (foundParams.searchText === '') {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        setIsNotFound(false);
      } else {
        setPageCount(1);
        setIsNotFound(true);
      }
    } else {
      setParams(foundParams.paramData.rows);
      const count = Math.ceil(foundParams.paramData.count / limit);
      setPageCount(count);
      setIsNotFound(false);
    }
  }, [foundParams]);

  useEffect(() => {
    if (paramsFilter.filter.isActive) {
      fetchWithFilters();
    } else if (paramsFilter.filter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveParamsFilter());
      fetchParams(page);
    } else if (forceUpdate) {
      fetchParams(page);
    }

    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchParams = (page: number, archive?: boolean) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    fetchParamsAPI(limit, page, archive)
      .then((data) => {
        setParams(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const fetchWithFilters = () => {
    const { archive } = paramsFilter;

    fetchParams(page, archive);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const reload = (page: number = 1) => {
    if (paramsFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchParams(page);
    }
  };

  const rowClickHandler = (row: Row<IParam>) => {
    dispatch(
      modalSlice.actions.openControlPanelEditParamModal({
        isShowing: true,
        paramId: row.values.id,
        mode: Modes.EDIT_MODE,
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: params });

  return (
    <div style={{ height: '100%' }}>
      <ControlPanelParamsToolbar setLimit={setLimit} reload={() => reload()} />
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

export default ControlPanelParamsTable;
