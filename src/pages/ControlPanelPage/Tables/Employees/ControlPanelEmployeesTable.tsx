import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { useDebounce } from 'hooks';
import { IEmployee, IEmployeesFilter } from 'models/api/IEmployee';
import EmployeeMenuCell from './Cells/EmployeeMenuCell';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import ControlPanelEmployeesToolbar from './Toolbar/ControlPanelEmployeesToolbar';
import { Modes } from 'constants/app';

const ControlPanelEmployeesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const employeesFilter = useAppSelector(
    (state) => state.controlPanel.employeesFilter
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
        Header: 'Имя',
        accessor: 'name',
        style: { width: '30%' },
      },
      {
        Header: 'Логин',
        accessor: 'login',
        style: { width: '40%' },
      },
      {
        Header: 'Роль',
        accessor: 'role.name',
        style: { width: '30%' },
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: EmployeeMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(controlPanelSlice.actions.setDisableFilter(true));
      fetchEmployees(page, { search });
    } else {
      dispatch(controlPanelSlice.actions.setDisableFilter(false));
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (employeesFilter.isActive) {
      fetchEmployees(page, employeesFilter);
    } else if (employeesFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('employeesFilter'));
      fetchEmployees(page);
    } else if (forceUpdate) {
      fetchEmployees(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchEmployees = (page: number, filter?: IEmployeesFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    EmployeeAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setEmployees(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (employeesFilter.isActive) {
      fetchEmployees(page, employeesFilter);
    } else {
      fetchEmployees(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IEmployee>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditEmployeeModal',
        props: { employeeId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <ControlPanelEmployeesToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={employees}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default ControlPanelEmployeesTable;
