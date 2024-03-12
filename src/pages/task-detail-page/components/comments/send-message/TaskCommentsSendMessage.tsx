import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { CreateTaskMessageDto } from 'api/TaskMessageAPI/dto/create-task-message.dto';
import { MessageInput } from 'components';
import EmojiPicker from 'components/ui/emoji-picker/EmojiPicker';
import { APP_ID, NOTIF_CATEGORY_ID } from 'constants/app';
import { getEmployeeShortName } from 'helpers/employee';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { FC, useState } from 'react';
import socketio from 'socket/socketio';
import { taskActions } from 'store/reducers/TaskSlice';

interface TaskCommentsSendMessageProps {
  taskId: number;
}

const TaskCommentsSendMessage: FC<TaskCommentsSendMessageProps> = ({
  taskId,
}) => {
  const [text, setText] = useState<string>('');

  const employee = useAppSelector((state) => state.employee.employee);
  const task = useAppSelector((state) => state.task.task);

  const dispatch = useAppDispatch();

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

    const title = `${getEmployeeShortName(employee)} — Задача № ${task.id}`;

    NotificationAPI.create({
      title,
      text,
      employeeIds,
      appId: APP_ID.Задачи,
      notificationCategoryId: NOTIF_CATEGORY_ID.Комментарии_к_задаче,
    }).then((data) => {
      socketio.sendNotification(data, employeeIds);
    });
  };

  return (
    <>
      <EmojiPicker
        onEmojiSelect={(emoji) =>
          setText((prevState) => prevState + emoji.native)
        }
      />
      <MessageInput
        value={text}
        onButtonClick={sendMessage}
        onChange={(e) => setText(e.target.value)}
      />
    </>
  );
};

export default TaskCommentsSendMessage;
