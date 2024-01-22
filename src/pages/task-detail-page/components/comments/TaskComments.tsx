import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { CreateTaskMessageDto } from 'api/TaskMessageAPI/dto/create-task-message.dto';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITaskMessage } from 'models/api/ITaskMessage';
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import socketio from 'socket/socketio';
import TaskCommentsContextMenu from './context-menu/TaskCommentsContextMenu';
import { IconMessageCircle } from '@tabler/icons-react';
import TaskCommentItemRight from './comment-item/TaskCommentItemRight';
import TaskCommentItemLeft from './comment-item/TaskCommentItemLeft';
import { Card, Divider, Text } from '@chakra-ui/react';
import { MessageInput } from 'components';
import { taskActions } from 'store/reducers/TaskSlice';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { FETCH_MORE_LIMIT } from 'constants/app';
import Loader, { LoaderWrapper } from 'components/ui/loader/Loader';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './TaskComments.module.scss';

interface TaskCommentsProps {
  taskId: number;
}

const TaskComments: FC<TaskCommentsProps> = ({ taskId }) => {
  const [text, setText] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const task = useAppSelector((state) => state.task.task);
  const taskMessages = useAppSelector((state) => state.task.taskMessages);
  const employee = useAppSelector((state) => state.employee.employee);

  const scrollableRootRef = useRef<HTMLDivElement | null>(null);
  const lastScrollDistanceToBottomRef = useRef<number>();

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

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage,
    onLoadMore: fetchMoreTaskMessages,
    rootMargin: '50px 0px 0px 0px',
  });

  useLayoutEffect(() => {
    const scrollableRoot = scrollableRootRef.current;
    const lastScrollDistanceToBottom =
      lastScrollDistanceToBottomRef.current ?? 0;
    if (scrollableRoot) {
      scrollableRoot.scrollTop =
        scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
    }
  }, [reversedTaskMessages, rootRef]);

  const rootRefSetter = useCallback(
    (node: HTMLDivElement) => {
      rootRef(node);
      scrollableRootRef.current = node;
    },
    [rootRef]
  );

  const handleRootScroll = useCallback(() => {
    const rootNode = scrollableRootRef.current;
    if (rootNode) {
      const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
      lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
    }
  }, []);

  const sendMessage = () => {
    if (text.trim() !== '' && employee) {
      const message: CreateTaskMessageDto = {
        message: text,
        taskId,
        employeeId: employee.id,
      };
      TaskMessageAPI.create(message).then((data) => {
        const createdMessage: ITaskMessage = {
          ...data,
          employee,
        };
        dispatch(taskActions.addTaskMessage(createdMessage));

        setTimeout(() => {
          if (scrollableRootRef.current) {
            scrollableRootRef.current.scrollTop =
              scrollableRootRef.current?.scrollHeight;
          }
        }, 0);

        notifyMembers(text);
        setText('');
      });
    }
  };

  const notifyMembers = (text: string) => {
    if (!task.taskMembers?.length) return;

    const employeeIds: number[] = [];
    if (task.creator && task.creator.id !== employee?.id) {
      employeeIds.push(task.creator.id);
    }
    task.taskMembers.forEach((taskMember) => {
      if (taskMember.employee.id !== employee?.id) {
        employeeIds.push(taskMember.employee.id);
      }
    });

    const title = `${getEmployeeFullName(employee)} — Задача № ${task.id}`;

    NotificationAPI.create({
      title,
      text,
      employeeIds,
      appId: 4,
      notificationCategoryId: 2,
    }).then((data) => {
      socketio.sendNotification(data, employeeIds);
    });
  };

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
            <div
              className={styles.messages}
              ref={rootRefSetter}
              onScroll={handleRootScroll}
            >
              {hasNextPage && (
                <LoaderWrapper isLoading size="30px" width="100%" height="100%">
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
          )}
          <Divider color="var(--divider-color)" />
          <div className={styles.message_input}>
            <MessageInput
              onButtonClick={sendMessage}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default TaskComments;
