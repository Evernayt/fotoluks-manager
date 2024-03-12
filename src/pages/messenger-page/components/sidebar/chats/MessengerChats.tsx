import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import ChatAPI from 'api/ChatAPI/ChatAPI';
import { FETCH_MORE_LIMIT } from 'constants/app';
import { messengerActions } from 'store/reducers/MessengerSlice';
import { Divider, useToast } from '@chakra-ui/react';
import { getErrorToast } from 'helpers/toast';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loader, { LoaderWrapper } from 'components/ui/loader/Loader';
import MessengerChat from './chat/MessengerChat';
import styles from './MessengerChats.module.scss';

const MessengerChats = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const chats = useAppSelector((state) => state.messenger.chats);
  const activeChat = useAppSelector((state) => state.messenger.activeChat);
  const employee = useAppSelector((state) => state.employee.employee);

  const hasNextPage = pageCount !== 0 && page !== pageCount;

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    reload();
  }, []);

  const fetchChats = (page: number) => {
    ChatAPI.getAll({ limit: FETCH_MORE_LIMIT, page, employeeId: employee?.id })
      .then((data) => {
        dispatch(messengerActions.addChats(data.rows));
        const count = Math.ceil(data.count / FETCH_MORE_LIMIT);
        setPageCount(count);
      })
      .catch((e) => toast(getErrorToast(e)))
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  };

  const reload = () => {
    setIsLoading(true);
    setPageCount(0);
    setPage(1);
    dispatch(messengerActions.setChats([]));
    fetchChats(1);
  };

  const fetchMoreChats = () => {
    setIsLoadingMore(true);
    setPage((prevState) => prevState + 1);
    fetchChats(page + 1);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage,
    onLoadMore: fetchMoreChats,
    rootMargin: '0px 0px 50px 0px',
  });

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        chats.length > 0 && (
          <>
            <Divider my="9px" />
            {chats.map((chat) => (
              <MessengerChat
                chat={chat}
                activeChat={activeChat}
                employeeId={employee?.id}
                key={chat.id}
              />
            ))}
            {hasNextPage && (
              <LoaderWrapper isLoading size="30px" width="100%" height="100%">
                <div className={styles.sentry} ref={sentryRef} />
              </LoaderWrapper>
            )}
          </>
        )
      )}
    </div>
  );
};

export default MessengerChats;
