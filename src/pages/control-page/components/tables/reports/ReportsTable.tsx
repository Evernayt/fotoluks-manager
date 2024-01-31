import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { Row, SortingState } from '@tanstack/react-table';
import { controlActions } from 'store/reducers/ControlSlice';
import { useContextMenu } from 'react-contexify';
import ReportsToolbar from './ReportsToolbar';
import { reportsTableColumns } from './ReportsTable.colums';
import { getErrorToast } from 'helpers/toast';
import { IReport } from 'models/api/IReport';
import ReportAPI from 'api/ReportAPI/ReportAPI';
import ReportsContextMenu, {
  REPORTS_MENU_ID,
} from './context-menu/ReportsContextMenu';

const ReportsTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [reports, setReports] = useState<IReport[]>([]);
  const [sortings, setSortings] = useState<SortingState>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: REPORTS_MENU_ID });

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (forceUpdate) {
      fetchReports(currentPage);
    }
    dispatch(controlActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchReports = (page: number) => {
    dispatch(controlActions.setIsLoading(true));

    ReportAPI.getAll({ limit, page, search })
      .then((data) => {
        setReports(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) => toast(getErrorToast('ReportsTable.fetchReports', e)))
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    fetchReports(page);
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const handleContextMenu = (row: Row<IReport>, event: any) => {
    show({ event, props: row.original });
  };

  return (
    <>
      <ReportsContextMenu />
      <ReportsToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={reportsTableColumns}
        data={reports}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        sorting={sortings}
        onSortingChange={setSortings}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ReportsTable;
