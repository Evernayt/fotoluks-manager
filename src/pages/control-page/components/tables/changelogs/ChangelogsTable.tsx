import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { controlActions } from 'store/reducers/ControlSlice';
import ChangelogsToolbar from './ChangelogsToolbar';
import { changelogsTableColumns } from './ChangelogsTable.colums';
import { getErrorToast } from 'helpers/toast';
import { IChangelog } from 'models/api/IChangelog';
import ChangelogAPI from 'api/ChangelogAPI/ChangelogAPI';
import { Row } from '@tanstack/react-table';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';

const ChangelogsTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [changelogs, setChangelogs] = useState<IChangelog[]>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (forceUpdate) {
      fetchChangelogs(currentPage);
    }
    dispatch(controlActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchChangelogs = (page: number) => {
    dispatch(controlActions.setIsLoading(true));

    ChangelogAPI.getAll({ limit, page, search })
      .then((data) => {
        setChangelogs(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) => toast(getErrorToast('ChangelogsTable.fetchChangelogs', e)))
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    fetchChangelogs(page);
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IChangelog>) => {
    dispatch(
      modalActions.openModal({
        modal: 'changelogsEditModal',
        props: {
          changelogId: row.original.id,
          version: row.original.version,
          mode: MODES.EDIT_MODE,
        },
      })
    );
  };

  return (
    <>
      <ChangelogsToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={changelogsTableColumns}
        data={changelogs}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default ChangelogsTable;
