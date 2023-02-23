import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import ControlPanelParamsToolbar from './Toolbar/ControlPanelParamsToolbar';
import { IParam, IParamsFilter } from 'models/api/IParam';
import { useDebounce } from 'hooks';
import ParamsMenuCell from './Cells/ParamsMenuCell';
import ParamAPI from 'api/ParamAPI/ParamAPI';

const ControlPanelParamsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [params, setParams] = useState<IParam[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const paramsFilter = useAppSelector(
    (state) => state.controlPanel.paramsFilter
  );

  const debouncedSearchTerm = useDebounce(search);
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
        style: { width: '30%' },
      },
      {
        Header: 'Значение',
        accessor: 'value',
        style: { width: '30%' },
      },
      {
        Header: 'Характеристика',
        accessor: 'feature.name',
        style: { width: '40%' },
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
    if (debouncedSearchTerm) {
      fetchParams(page, { ...paramsFilter, search });
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (paramsFilter.isActive) {
      fetchParams(page, paramsFilter);
    } else if (paramsFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('paramsFilter'));
      fetchParams(page);
    } else if (forceUpdate) {
      fetchParams(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchParams = (page: number, filter?: IParamsFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    ParamAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setParams(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (paramsFilter.isActive) {
      fetchParams(page, paramsFilter);
    } else {
      fetchParams(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IParam>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditParamModal',
        props: { paramId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <ControlPanelParamsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={params}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default ControlPanelParamsTable;
