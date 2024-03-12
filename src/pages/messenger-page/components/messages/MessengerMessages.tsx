import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import MessengerMessageContextMenu from './context-menu/MessengerMessageContextMenu';
import { IconMessageCircle } from '@tabler/icons-react';
import MessengerMessageItemRight from './message-item/MessengerMessageItemRight';
import MessengerMessageItemLeft from './message-item/MessengerMessageItemLeft';
import { Card, Divider, Text } from '@chakra-ui/react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { FETCH_MORE_LIMIT } from 'constants/app';
import Loader, { LoaderWrapper } from 'components/ui/loader/Loader';
import ChatMessageAPI from 'api/ChatMessageAPI/ChatMessageAPI';
import { messengerActions } from 'store/reducers/MessengerSlice';
import MessengerToolbar from './toolbar/MessengerToolbar';
import ScrollableFeed from 'react-scrollable-feed';
import MessengerSendImage from './send-image/MessengerSendImage';
import MessengerSendMessage from './send-message/MessengerSendMessage';
import styles from './MessengerMessages.module.scss';

const MessengerMessages = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const activeChat = useAppSelector((state) => state.messenger.activeChat);
  const chatMessages = useAppSelector((state) => state.messenger.chatMessages);
  const employee = useAppSelector((state) => state.employee.employee);

  const scrollableRef = useRef<ScrollableFeed>(null);

  const reversedChatMessages = useMemo(
    () => [...chatMessages].reverse(),
    [chatMessages]
  );

  const hasNextPage = pageCount !== 0 && page !== pageCount;

  const dispatch = useAppDispatch();

  useEffect(() => {
    reload();
  }, [activeChat]);

  const fetchChatMessages = (page: number) => {
    if (!activeChat) return;

    ChatMessageAPI.getAll({
      chatId: activeChat.id,
      limit: FETCH_MORE_LIMIT,
      page,
    })
      .then((data) => {
        dispatch(messengerActions.addChatMessages(data.rows));
        const count = Math.ceil(data.count / FETCH_MORE_LIMIT);
        setPageCount(count);
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 300);
        setIsLoadingMore(false);
      });
  };

  const reload = () => {
    setIsLoading(true);
    setPageCount(0);
    setPage(1);
    dispatch(messengerActions.setChatMessages([]));
    fetchChatMessages(1);

    scrollToBottom();
  };

  const fetchMoreChatMessages = () => {
    setIsLoadingMore(true);
    setPage((prevState) => prevState + 1);
    fetchChatMessages(page + 1);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage,
    onLoadMore: fetchMoreChatMessages,
    rootMargin: '50px 0px 0px 0px',
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollableRef.current?.scrollToBottom();
    }, 1000);
  };

  return (
    <Card className={styles.container}>
      <MessengerMessageContextMenu />
      {activeChat ? (
        isLoading ? (
          <Loader />
        ) : (
          <>
            <MessengerToolbar activeChat={activeChat} />
            {chatMessages?.length === 0 ? (
              <div className={styles.no_messages}>
                <IconMessageCircle
                  className="link-icon"
                  size={48}
                  stroke={1.1}
                />
                <Text variant="secondary">Нет сообщений</Text>
              </div>
            ) : (
              <ScrollableFeed
                className={styles.messages_container}
                ref={scrollableRef}
              >
                <div className={styles.messages}>
                  {hasNextPage && (
                    <LoaderWrapper
                      isLoading
                      size="30px"
                      width="100%"
                      height="100%"
                    >
                      <div className={styles.sentry} ref={sentryRef} />
                    </LoaderWrapper>
                  )}
                  {reversedChatMessages.map((chatMessage) => {
                    if (chatMessage.employee.id === employee?.id) {
                      return (
                        <MessengerMessageItemRight
                          chatMessage={chatMessage}
                          key={chatMessage.id}
                        />
                      );
                    } else {
                      return (
                        <MessengerMessageItemLeft
                          chatMessage={chatMessage}
                          key={chatMessage.id}
                        />
                      );
                    }
                  })}
                </div>
              </ScrollableFeed>
            )}
            <Divider color="var(--divider-color)" />
            <div className={styles.message_input}>
              <MessengerSendImage />
              <MessengerSendMessage />
            </div>
          </>
        )
      ) : (
        <div className={styles.no_messages}>
          <IconMessageCircle className="link-icon" size={48} stroke={1.1} />
          <Text variant="secondary">Выберите или создайте чат</Text>
        </div>
      )}
    </Card>
  );
};

export default MessengerMessages;
