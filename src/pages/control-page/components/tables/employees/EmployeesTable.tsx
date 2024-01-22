import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { filterActions } from 'store/reducers/FilterSlice';
import { Row } from '@tanstack/react-table';
import { controlActions } from 'store/reducers/ControlSlice';
import { useContextMenu } from 'react-contexify';
import EmployeesToolbar from './EmployeesToolbar';
import { IEmployee, IEmployeesFilter } from 'models/api/IEmployee';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { employeesTableColumns } from './EmployeesTable.colums';
import EmployeesContextMenu, {
  EMPLOYEES_MENU_ID,
} from './context-menu/EmployeesContextMenu';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import { IEmployeeWithConnection } from './EmployeesTable.types';

const EmployeesTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [employees, setEmployees] = useState<IEmployeeWithConnection[]>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const employeesFilter = useAppSelector(
    (state) => state.filter.employeesFilter
  );
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);
  const onlineEmployees = useAppSelector((state) => state.app.onlineEmployees);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: EMPLOYEES_MENU_ID });

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (employeesFilter.isActive) {
      reloadAndChangePage(1);
    } else if (employeesFilter.isPendingDeactivation) {
      dispatch(filterActions.deactiveFilter('employeesFilter'));
      fetchEmployees(currentPage);
    } else if (forceUpdate) {
      fetchEmployees(currentPage);
    }
    dispatch(controlActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchEmployees = (page: number, filter?: IEmployeesFilter) => {
    dispatch(controlActions.setIsLoading(true));

    EmployeeAPI.getAll({ ...filter, limit, page, search })
      .then((data) => {
        const employeesWithConnections: IEmployeeWithConnection[] = [];
        data.rows.forEach((employee) => {
          const isOnline = onlineEmployees.some(
            (x) => x.employeeId === employee.id
          );
          employeesWithConnections.push({
            ...employee,
            connectionStatus: isOnline ? 'В сети' : 'Не в сети',
          });
        });
        setEmployees(employeesWithConnections);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) =>
        toast({
          title: 'EmployeesTable.fetchEmployees',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    if (employeesFilter.isActive) {
      fetchEmployees(page, employeesFilter);
    } else {
      fetchEmployees(page);
    }
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IEmployee>) => {
    dispatch(
      modalActions.openModal({
        modal: 'employeesEditModal',
        props: { employeeId: row.original.id, mode: MODES.EDIT_MODE },
      })
    );
  };

  const handleContextMenu = (row: Row<IEmployee>, event: any) => {
    show({ event, props: row.original });
  };

  return (
    <>
      <EmployeesContextMenu />
      <EmployeesToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={employeesTableColumns}
        data={employees}
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

export default EmployeesTable;
