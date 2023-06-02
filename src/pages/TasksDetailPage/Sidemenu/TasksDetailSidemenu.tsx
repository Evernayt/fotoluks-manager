import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import {
  AvatarList,
  Button,
  Checkbox,
  ElectronLinkify,
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
import { IconBinaryTree, IconShop } from 'icons';
import { IDepartment } from 'models/api/IDepartment';
import { IShop } from 'models/api/IShop';
import { FC, useEffect, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { taskSlice } from 'store/reducers/TaskSlice';
import TasksDetailExecutor from '../Executor/TasksDetailExecutor';
import styles from './TasksDetailSidemenu.module.scss';

interface TasksDetailSidemenuProps {
  cancelTaskModal: IModal;
  saveTask: () => void;
}

const TasksDetailSidemenu: FC<TasksDetailSidemenuProps> = ({
  cancelTaskModal,
  saveTask,
}) => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [completionNote, setCompletionNote] = useState<string>('');

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

  const openCancelModal = () => {
    cancelTaskModal.toggle();
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
        <Tooltip label="Филиал">
          <SelectButton
            items={shops}
            defaultSelectedItem={shop}
            onChange={(item) => dispatch(taskSlice.actions.setShop(item))}
          />
        </Tooltip>
        <Tooltip label="Отдел">
          <SelectButton
            items={departments}
            defaultSelectedItem={department}
            onChange={(item) => dispatch(taskSlice.actions.setDepartment(item))}
          />
        </Tooltip>
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
            {iCreator ? editingRender() : readingRender()}
          </div>
        </div>
      </div>

      {iCreator && (
        <div className={styles.controls}>
          {haveUnsavedData && (
            <Button onClick={openCancelModal}>Отменить</Button>
          )}
          <Button
            variant={ButtonVariants.primary}
            disabled={!haveUnsavedData}
            onClick={saveTask}
          >
            Сохранить
          </Button>
        </div>
      )}
    </div>
  );
};

export default TasksDetailSidemenu;
