import {
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { IconBell, IconClearAll, IconRefresh } from '@tabler/icons-react';
import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { ICON_SIZE, ICON_STROKE, FETCH_MORE_LIMIT } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { appActions } from 'store/reducers/AppSlice';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import Loader, { LoaderWrapper } from 'components/ui/loader/Loader';
import Notification from './notification/Notification';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import styles from './NavbarNotifications.module.scss';

const NavbarNotifications = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const notifications = useAppSelector((state) => state.employee.notifications);
  const employee = useAppSelector((state) => state.employee.employee);
  const notificationsBadge = useAppSelector(
    (state) => state.app.notificationsBadge
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const hasNextPage = pageCount !== 0 && page !== pageCount;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && !notifications.length) {
      reload();
    }
  }, [isOpen]);

  const fetchNotifications = (page: number) => {
    if (!employee) return;
    NotificationAPI.getAll({
      limit: FETCH_MORE_LIMIT,
      page,
      employeeId: employee.id,
    })
      .then((data) => {
        dispatch(employeeActions.addNotifications(data.rows));
        const count = Math.ceil(data.count / FETCH_MORE_LIMIT);
        setPageCount(count);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  };

  const reload = () => {
    setIsLoading(true);
    setPageCount(0);
    setPage(1);
    dispatch(employeeActions.clearNotifications());
    fetchNotifications(1);
  };

  const fetchMoreNotifications = () => {
    setIsLoadingMore(true);
    setPage((prevState) => prevState + 1);
    fetchNotifications(page + 1);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage,
    onLoadMore: fetchMoreNotifications,
    rootMargin: '0px 0px 50px 0px',
  });

  const deleteAllNotifications = () => {
    if (!employee) return;
    setIsLoading(true);
    NotificationAPI.deleteByEmployeeId(employee.id)
      .then(() => {
        dispatch(employeeActions.clearNotifications());
        setPage(1);
        setPageCount(0);
      })
      .finally(() => setIsLoading(false));
  };

  const openNotifications = () => {
    dispatch(appActions.setNoificationsBadge(false));
  };

  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      autoSelect={false}
      isLazy
    >
      <MenuButton
        as={IconButton}
        icon={<IconBell size={ICON_SIZE} stroke={ICON_STROKE} />}
        aria-label="bell"
        colorScheme={notificationsBadge ? 'yellow' : 'gray'}
        isRound
        onClick={openNotifications}
      />
      <MenuList p={0}>
        <div className={styles.notifications_header}>
          <Heading size="md">Уведомления</Heading>
          <div>
            <IconButton
              icon={
                <IconRefresh
                  className="link-icon"
                  size={ICON_SIZE}
                  stroke={ICON_STROKE}
                />
              }
              aria-label="reload"
              variant="ghost"
              onClick={reload}
            />
            <Tooltip label="Очистить всё" placement="left">
              <IconButton
                icon={
                  <IconClearAll
                    className="link-icon"
                    size={ICON_SIZE}
                    stroke={ICON_STROKE}
                  />
                }
                aria-label="clear"
                variant="ghost"
                onClick={deleteAllNotifications}
              />
            </Tooltip>
          </div>
        </div>
        <div className={styles.notifications}>
          {isLoading ? (
            <Loader minHeight="442px" />
          ) : (
            <>
              {!notifications.length && (
                <div className={styles.no_notifications}>
                  <IconBell className="link-icon" size={48} stroke={1.1} />
                  <Text variant="secondary">Нет уведомлений</Text>
                </div>
              )}
              {notifications.map((notification) => (
                <Notification
                  notification={notification}
                  key={notification.id}
                />
              ))}
              {hasNextPage && (
                <LoaderWrapper isLoading size="30px" width="100%" height="100%">
                  <div className={styles.sentry} ref={sentryRef} />
                </LoaderWrapper>
              )}
            </>
          )}
        </div>
      </MenuList>
    </Menu>
  );
};

export default NavbarNotifications;
