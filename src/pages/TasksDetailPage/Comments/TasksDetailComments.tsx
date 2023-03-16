import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { CreateTaskMessageDto } from 'api/TaskMessageAPI/dto/create-task-message.dto';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { IconButton } from 'components';
import { IconButtonVariants } from 'components/UI/IconButton/IconButton';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconMessageCircle, IconSend } from 'icons';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import socketio from 'socket/socketio';
import { taskSlice } from 'store/reducers/TaskSlice';
import TaskDetailCommentItemLeft from './CommentItem/TaskDetailCommentItemLeft';
import TaskDetailCommentItemRight from './CommentItem/TaskDetailCommentItemRight';
import styles from './TasksDetailComments.module.scss';

const TasksDetailComments = () => {
  const [text, setText] = useState<string>('');

  const task = useAppSelector((state) => state.task.task);
  const taskMessages = useAppSelector((state) => state.task.taskMessages);
  const employee = useAppSelector((state) => state.employee.employee);

  const messageListRef = useRef<HTMLUListElement>(null);
  const messageTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const messageTextAreaFrameRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current?.scrollHeight;
    }
  }, [taskMessages]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current?.scrollHeight;
    }
  }, [messageTextAreaRef.current?.style.height]);

  const sendMessage = () => {
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
        notifyMembers();
        setText('');
      });
    }
  };

  const resizeTextArea = () => {
    if (messageTextAreaRef.current && messageTextAreaFrameRef.current) {
      messageTextAreaRef.current.style.height = '0px';
      const height = Math.min(100, messageTextAreaRef.current.scrollHeight);
      messageTextAreaFrameRef.current.style.height = `${height}px`;
      messageTextAreaRef.current.style.height = `${height}px`;
    }
  };

  const sendMessageAndResize = () => {
    setTimeout(() => {
      sendMessage();
      if (messageTextAreaRef.current && messageTextAreaFrameRef.current) {
        messageTextAreaFrameRef.current.style.height = '17px';
        messageTextAreaRef.current.style.height = '17px';
        messageTextAreaRef.current.focus();
      }
    }, 0);
  };

  const autoResize = (event: KeyboardEvent) => {
    if (event.code === 'Enter' && !event.shiftKey) {
      sendMessageAndResize();
    } else {
      setTimeout(() => {
        resizeTextArea();
      }, 0);
    }
  };

  const notifyMembers = () => {
    if (!task.taskMembers?.length) return;

    const employeeIds: number[] = [];
    task.taskMembers.forEach((taskMember) => {
      if (taskMember.employee.id !== employee?.id) {
        employeeIds.push(taskMember.employee.id);
      }
    });

    const title = `${employee?.name} — Задача № ${task.id}`;

    NotificationAPI.create({ title, text, employeeIds, appId: 4 }).then(
      (data) => {
        socketio.sendNotification(data);
      }
    );
  };

  return (
    <div className={styles.container}>
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

      <div className={styles.inputs}>
        <div
          className={styles.text_input_frame}
          ref={messageTextAreaFrameRef}
          onClick={() => messageTextAreaRef.current?.focus()}
        >
          <textarea
            className={styles.text_input}
            placeholder="Введите комментарий"
            ref={messageTextAreaRef}
            rows={1}
            value={text}
            onKeyDown={autoResize}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <IconButton
          className={styles.send_btn}
          variant={IconButtonVariants.link}
          icon={
            <IconSend className={['link-icon', styles.send_icon].join(' ')} />
          }
          circle
          onClick={sendMessageAndResize}
        />
      </div>
    </div>
  );
};

export default TasksDetailComments;
