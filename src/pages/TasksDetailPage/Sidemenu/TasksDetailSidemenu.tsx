import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import {
  AvatarList,
  Button,
  Checkbox,
  ElectronLinkify,
  IconButton,
  SelectButton,
  Textarea,
  Textbox,
  Tooltip,
} from 'components';
import { IAvatarListItem } from 'components/UI/AvatarList/AvatarList.types';
import { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IModal } from 'hooks/useModal';
import {
  IconBinaryTree,
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
  IconRotate2,
  IconShop,
} from 'icons';
import { IDepartment } from 'models/api/IDepartment';
import { IShop } from 'models/api/IShop';
import { FC, useEffect, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { taskSlice } from 'store/reducers/TaskSlice';
import TasksDetailExecutor from '../Executor/TasksDetailExecutor';
import styles from './TasksDetailSidemenu.module.scss';
import TaskSubtaskAPI from 'api/TaskSubtaskAPI/TaskSubtaskAPI';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { IconButtonVariants } from 'components/UI/IconButton/IconButton';

interface TasksDetailSidemenuProps {
  cancelTaskModal: IModal;
  saveTask: (close: boolean) => void;
  closeTaskDetail: () => void;
}

const TasksDetailSidemenu: FC<TasksDetailSidemenuProps> = ({
  cancelTaskModal,
  saveTask,
  closeTaskDetail,
}) => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [completionNote, setCompletionNote] = useState<string>('');
  const [viewMode, setViewMode] = useState<boolean>(false);

  const task = useAppSelector((state) => state.task.task);
  const beforeTask = useAppSelector((state) => state.task.beforeTask);
  const name = useAppSelector((state) => state.task.task.name);
  const title = useAppSelector((state) => state.task.task.title);
  const description = useAppSelector((state) => state.task.task.description);
  const shop = useAppSelector((state) => state.task.task.shop);
  const department = useAppSelector((state) => state.task.task.department);
  const urgent = useAppSelector((state) => state.task.task.urgent);
  const haveUnsavedData = useAppSelector((state) => state.task.haveUnsavedData);
  const employee = useAppSelector((state) => state.employee.employee);

  const isTaskCreated = task.id !== 0;
  const iCreator = task.creator ? task.creator.id === employee?.id : true;

  const taskMembers = useMemo(() => {
    const employees: IAvatarListItem[] = [];
    task.taskMembers?.forEach((taskMember) => {
      employees.push({
        id: taskMember.employee.id,
        name: taskMember.employee.name,
        avatar: taskMember.employee.avatar || defaultAvatar,
      });
    });
    return employees;
  }, [task.taskMembers]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchShops();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (viewMode) return;
    JSON.stringify(task) != JSON.stringify(beforeTask)
      ? dispatch(taskSlice.actions.setHaveUnsavedData(true))
      : dispatch(taskSlice.actions.setHaveUnsavedData(false));
  }, [task]);

  const fetchShops = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setShops(data.rows);
    });
  };

  const fetchDepartments = () => {
    DepartmentAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setDepartments(data.rows);
    });
  };

  const completeTask = () => {
    TaskAPI.update({
      id: task.id,
      completed: true,
      completedDate: new Date().toUTCString(),
      completionNote,
      executorId: employee?.id,
    }).then((data) => {
      dispatch(taskSlice.actions.setTask(data));
      dispatch(taskSlice.actions.setBeforeTask(data));
      dispatch(taskSlice.actions.setHaveUnsavedData(false));
    });
  };

  const toggleSubtask = (id: number | string, completed: boolean) => {
    if (typeof id === 'string') return;

    dispatch(taskSlice.actions.editTaskSubtaskById({ id, completed }));
    TaskSubtaskAPI.update({ id, completed }).catch((e) => {
      showGlobalMessage(e.response.data ? e.response.data.message : e.message);
      dispatch(
        taskSlice.actions.editTaskSubtaskById({ id, completed: !completed })
      );
    });
  };

  const openCancelModal = () => {
    cancelTaskModal.toggle();
  };

  const openTaskSubtasksModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'taskSubtasksModal' }));
  };

  const openTaskMembersModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'taskMembersModal' }));
  };

  const taskCompletedRender = () => {
    return task.completed ? (
      <TasksDetailExecutor />
    ) : (
      <>
        <div className={styles.inputs}>
          <Button
            variant={ButtonVariants.primaryDeemphasized}
            onClick={completeTask}
          >
            Завершить
          </Button>
          <Textbox
            label="Примечание (необязательно)"
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
          />
        </div>
        <div className="separator" />
      </>
    );
  };

  const editingRender = () => {
    return (
      <div className={styles.inputs}>
        <Textbox
          label="Заголовок"
          value={name}
          onChange={(e) => dispatch(taskSlice.actions.setName(e.target.value))}
        />
        <Textarea
          label="Что не так"
          style={{ resize: 'vertical' }}
          value={title}
          onChange={(e) => dispatch(taskSlice.actions.setTitle(e.target.value))}
        />
        <Textarea
          label="Что сделать"
          style={{ resize: 'vertical' }}
          value={description}
          onChange={(e) =>
            dispatch(taskSlice.actions.setDescription(e.target.value))
          }
        />
        <Button onClick={openTaskSubtasksModal}>
          {task.taskSubtasks && task.taskSubtasks.length > 0
            ? `Список подзадач: ${task.taskSubtasks.length}`
            : 'Добавить подзадачи'}
        </Button>
        <SelectButton
          title="Филиал"
          items={shops}
          defaultSelectedItem={shop}
          onChange={(item) => dispatch(taskSlice.actions.setShop(item))}
        />
        <SelectButton
          title="Отдел"
          items={departments}
          defaultSelectedItem={department}
          onChange={(item) => dispatch(taskSlice.actions.setDepartment(item))}
        />
        <Button onClick={openTaskMembersModal}>
          {task.taskMembers && task.taskMembers.length > 0
            ? `Список участников: ${task.taskMembers.length}`
            : 'Добавить участников'}
        </Button>
        <Checkbox
          text="Срочно"
          checked={urgent}
          onChange={() => dispatch(taskSlice.actions.setUrgent(!urgent))}
        />
      </div>
    );
  };

  const readingRender = () => {
    return (
      <>
        <div className={styles.items}>
          {task.urgent && <div className={styles.urgent}>Срочно</div>}
          <div className={styles.item}>
            <IconShop className={styles.item_icon} />
            <div className={styles.item_text}>{shop?.abbreviation}</div>
          </div>
          <div className={styles.item}>
            <IconBinaryTree className={styles.item_icon} />
            <div className={styles.item_text}>{department?.name}</div>
          </div>
          <div className={styles.item}>
            <div
              className={styles.item_text}
            >{`Создатель: ${task.creator?.name}`}</div>
          </div>
        </div>
        {name && (
          <div>
            <div className={styles.title}>Заголовок</div>
            <ElectronLinkify>{name}</ElectronLinkify>
          </div>
        )}
        <div>
          <div className={styles.title}>Что не так</div>
          <ElectronLinkify>{title}</ElectronLinkify>
        </div>
        <div>
          <div className={styles.title}>Что сделать</div>
          <ElectronLinkify>{description}</ElectronLinkify>
        </div>
        <div className={styles.subtasks}>
          {task.taskSubtasks?.map((taskSubtask) => (
            <Checkbox
              text={taskSubtask.text}
              checked={taskSubtask.completed}
              onChange={(e) => toggleSubtask(taskSubtask.id, e.target.checked)}
              key={taskSubtask.id}
            />
          ))}
        </div>
        {taskMembers.length > 0 && (
          <div>
            <div className={styles.title}>Участники</div>
            <AvatarList items={taskMembers} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.panel}
        style={{ height: iCreator ? 'calc(100% - 72px)' : '100%' }}
      >
        <div>
          {isTaskCreated && taskCompletedRender()}
          <div className={styles.info}>
            {iCreator && !viewMode ? editingRender() : readingRender()}
          </div>
        </div>
      </div>

      {iCreator && (
        <div className={styles.controls}>
          {haveUnsavedData ? (
            <>
              <Tooltip label="Отменить изменения">
                <div>
                  <IconButton
                    icon={<IconRotate2 className="secondary-icon" />}
                    onClick={openCancelModal}
                  />
                </div>
              </Tooltip>
              <Tooltip label="Сохранить">
                <div>
                  <IconButton
                    variant={IconButtonVariants.primary}
                    icon={<IconDeviceFloppy className="primary-icon" />}
                    onClick={() => saveTask(false)}
                  />
                </div>
              </Tooltip>
              <Button
                variant={ButtonVariants.primary}
                disabled={!haveUnsavedData}
                onClick={() => saveTask(true)}
              >
                Сохранить и выйти
              </Button>
            </>
          ) : (
            <>
              {isTaskCreated && (
                <Tooltip
                  label={viewMode ? 'Режим редактирования' : 'Режим просмотра'}
                >
                  <div>
                    <IconButton
                      icon={
                        viewMode ? (
                          <IconEyeOff className="secondary-icon" />
                        ) : (
                          <IconEye className="secondary-icon" />
                        )
                      }
                      onClick={() => setViewMode((prevState) => !prevState)}
                    />
                  </div>
                </Tooltip>
              )}
              <Button
                variant={ButtonVariants.primary}
                onClick={closeTaskDetail}
              >
                Выйти
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksDetailSidemenu;
