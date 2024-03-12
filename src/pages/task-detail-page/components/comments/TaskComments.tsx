import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useEffect, useMemo, useState } from 'react';
import TaskCommentsContextMenu from './context-menu/TaskCommentsContextMenu';
import { IconMessageCircle } from '@tabler/icons-react';
import TaskCommentItemRight from './comment-item/TaskCommentItemRight';
import TaskCommentItemLeft from './comment-item/TaskCommentItemLeft';
import { Card, Divider, Text } from '@chakra-ui/react';
import { taskActions } from 'store/reducers/TaskSlice';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { FETCH_MORE_LIMIT } from 'constants/app';
import Loader, { LoaderWrapper } from 'components/ui/loader/Loader';
import ScrollableFeed from 'react-scrollable-feed';
import TaskCommentsSendMessage from './send-message/TaskCommentsSendMessage';
import styles from './TaskComments.module.scss';

interface TaskCommentsProps {
  taskId: number;
}

const TaskComments: FC<TaskCommentsProps> = ({ taskId }) => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const taskMessages = useAppSelector((state) => state.task.taskMessages);
  const employee = useAppSelector((state) => state.employee.employee);

  const reversedTaskMessages = useMemo(
    () => [...taskMessages].reverse(),
    [taskMessages]
  );

  const hasNextPage = pageCount !== 0 && page !== pageCount;

  const dispatch = useAppDispatch();

  useEffect(() => {
    reload();
  }, []);

  const fetchTaskMessages = (page: number) => {
    TaskMessageAPI.getAll({
      taskId,
      limit: FETCH_MORE_LIMIT,
      page,
    })
      .then((data) => {
        dispatch(taskActions.addTaskMessages(data.rows));
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
    dispatch(taskActions.setTaskMessages([]));
    fetchTaskMessages(1);
  };

  const fetchMoreTaskMessages = () => {
    setIsLoadingMore(true);
    setPage((prevState) => prevState + 1);
    fetchTaskMessages(page + 1);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage,
    onLoadMore: fetchMoreTaskMessages,
    rootMargin: '50px 0px 0px 0px',
  });

  return (
    <Card className={styles.container}>
      <TaskCommentsContextMenu />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {taskMessages.length === 0 ? (
            <div className={styles.no_comments}>
              <IconMessageCircle className="link-icon" size={48} stroke={1.1} />
              <Text variant="secondary">Нет комментариев</Text>
            </div>
          ) : (
            <ScrollableFeed className={styles.messages_container}>
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
                {reversedTaskMessages.map((taskMessage) => {
                  if (taskMessage.employee.id === employee?.id) {
                    return (
                      <TaskCommentItemRight
                        taskMessage={taskMessage}
                        key={taskMessage.id}
                      />
                    );
                  } else {
                    return (
                      <TaskCommentItemLeft
                        taskMessage={taskMessage}
                        key={taskMessage.id}
                      />
                    );
                  }
                })}
              </div>
            </ScrollableFeed>
          )}
          <Divider color="var(--divider-color)" />
          <div className={styles.message_input}>
            <TaskCommentsSendMessage taskId={taskId} />
          </div>
        </>
      )}
    </Card>
  );
};

export default TaskComments;
