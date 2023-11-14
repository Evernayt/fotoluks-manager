import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { CreateTaskMessageDto } from 'api/TaskMessageAPI/dto/create-task-message.dto';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { MessageTextbox } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconMessageCircle } from 'icons';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { useEffect, useRef } from 'react';
import socketio from 'socket/socketio';
import { taskSlice } from 'store/reducers/TaskSlice';
import TaskDetailCommentItemLeft from './CommentItem/TaskDetailCommentItemLeft';
import TaskDetailCommentItemRight from './CommentItem/TaskDetailCommentItemRight';
import styles from './TasksDetailComments.module.scss';
import TaskDetailCommentsContextMenu from './ContextMenu/TaskDetailCommentsContextMenu';
import { onButtonClickProps } from 'components/UI/MessageTextbox/MessageTextbox';

const TasksDetailComments = () => {
  const task = useAppSelector((state) => state.task.task);
  const taskMessages = useAppSelector((state) => state.task.taskMessages);
  const employee = useAppSelector((state) => state.employee.employee);

  const messageListRef = useRef<HTMLUListElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current?.scrollHeight;
    }
  }, [taskMessages]);

  const sendMessage = ({ text, setText }: onButtonClickProps) => {
    if (text.trim() !== '' && employee) {
      const message: CreateTaskMessageDto = {
        message: text,
        taskId: task.id,
        employeeId: employee.id,
      };
      TaskMessageAPI.create(message).then((data) => {
        const createdMessage: ITaskMessage = {
          ...data,
          employee,
        };
        dispatch(taskSlice.actions.addTaskMessage(createdMessage));
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

    const title = `${employee?.name} — Задача № ${task.id}`;

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
    <div className={styles.container}>
      <TaskDetailCommentsContextMenu />
      {taskMessages.length === 0 ? (
        <div className={styles.no_comments}>
          <IconMessageCircle className="link-icon" size={48} stroke={1.1} />
          <div>Нет комментариев</div>
        </div>
      ) : (
        <ul className={styles.messages} ref={messageListRef}>
          {taskMessages.map((taskMessage) => {
            if (taskMessage.employee.id === employee?.id) {
              return (
                <TaskDetailCommentItemRight
                  taskMessage={taskMessage}
                  key={taskMessage.id}
                />
              );
            } else {
              return (
                <TaskDetailCommentItemLeft
                  taskMessage={taskMessage}
                  key={taskMessage.id}
                />
              );
            }
          })}
        </ul>
      )}
      <div className={styles.message_input}>
        <MessageTextbox
          messageListRef={messageListRef}
          onButtonClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default TasksDetailComments;
