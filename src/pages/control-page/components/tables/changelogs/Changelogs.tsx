import { Divider, Heading, useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { controlActions } from 'store/reducers/ControlSlice';
import ChangelogsToolbar from './ChangelogsToolbar';
import { getErrorToast } from 'helpers/toast';
import { IChangelog } from 'models/api/IChangelog';
import ChangelogAPI from 'api/ChangelogAPI/ChangelogAPI';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import { checkAccessByRole } from 'helpers/employee';
import { Loader } from 'components';
import Pagination from 'components/ui/pagination/Pagination';
import Changelog from './changelog/Changelog';
import styles from './Changelogs.module.scss';

const Changelogs = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [changelogs, setChangelogs] = useState<IChangelog[]>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);
  const employee = useAppSelector((state) => state.employee.employee);

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

  const openChangelogsEditModal = (changelog: IChangelog) => {
    if (!checkAccessByRole(employee, 'Разработчик')) return;
    dispatch(
      modalActions.openModal({
        modal: 'changelogsEditModal',
        props: {
          changelogId: changelog.id,
          version: changelog.version,
          mode: MODES.EDIT_MODE,
        },
      })
    );
  };

  return (
    <>
      <ChangelogsToolbar reload={reload} onLimitChange={setLimit} />
      <div className={styles.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {changelogs.length ? (
              <div className={styles.changelogs}>
                {changelogs.map((changelog) => (
                  <Changelog
                    changelog={changelog}
                    onClick={openChangelogsEditModal}
                    key={changelog.id}
                  />
                ))}
              </div>
            ) : (
              <Heading className={styles.message} size="md">
                Ничего не найдено
              </Heading>
            )}
          </>
        )}
      </div>
      {pageCount > 1 && (
        <div>
          <Divider />
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={reloadAndChangePage}
          />
        </div>
      )}
    </>
  );
};

export default Changelogs;
