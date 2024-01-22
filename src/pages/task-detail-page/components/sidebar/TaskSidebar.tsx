import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { taskActions } from 'store/reducers/TaskSlice';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Switch,
  Tag,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import TaskSubtaskAPI from 'api/TaskSubtaskAPI/TaskSubtaskAPI';
import { modalActions } from 'store/reducers/ModalSlice';
import TaskExecutor from '../executor/TaskExecutor';
import { AutoResizableTextarea, Linkify, Select } from 'components';
import {
  IconBinaryTree2,
  IconBuildingStore,
  IconCircleCheck,
  IconDeviceFloppy,
  IconEye,
  IconListCheck,
  IconPencil,
  IconRotate2,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import styles from './TaskSidebar.module.scss';

interface TaskSidebarProps {
  saveTask: (close: boolean) => void;
  closeTaskDetail: () => void;
  viewMode: boolean;
  setViewMode: (viewMode: boolean) => void;
}

const TaskSidebar: FC<TaskSidebarProps> = ({
  saveTask,
  closeTaskDetail,
  viewMode,
  setViewMode,
}) => {
  const [completionNote, setCompletionNote] = useState<string>('');

  const task = useAppSelector((state) => state.task.task);
  const beforeTask = useAppSelector((state) => state.task.beforeTask);
  const title = useAppSelector((state) => state.task.task.title);
  const description = useAppSelector((state) => state.task.task.description);
  const shop = useAppSelector((state) => state.task.task.shop);
  const department = useAppSelector((state) => state.task.task.department);
  const urgent = useAppSelector((state) => state.task.task.urgent);
  const personal = useAppSelector((state) => state.task.task.personal);
  const haveUnsavedData = useAppSelector((state) => state.task.haveUnsavedData);
  const employee = useAppSelector((state) => state.employee.employee);
  const shopsWithGeneral = useAppSelector(
    (state) => state.app.shopsWithGeneral
  );
  const departmentsWithGeneral = useAppSelector(
    (state) => state.app.departmentsWithGeneral
  );

  const isTaskCreated = task.id !== 0;
  const iCreator = task.creator ? task.creator.id === employee?.id : true;

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (viewMode) return;
    JSON.stringify(task) != JSON.stringify(beforeTask)
      ? dispatch(taskActions.setHaveUnsavedData(true))
      : dispatch(taskActions.setHaveUnsavedData(false));
  }, [task]);

  const completeTask = () => {
    TaskAPI.update({
      id: task.id,
      completed: true,
      completedDate: new Date().toISOString(),
      completionNote,
      executorId: employee?.id,
    }).then((data) => {
      dispatch(taskActions.setTask(data));
      dispatch(taskActions.setBeforeTask(data));
      dispatch(taskActions.setHaveUnsavedData(false));
    });
  };

  const toggleSubtask = (id: number | string, completed: boolean) => {
    if (typeof id === 'string') return;

    dispatch(taskActions.editTaskSubtaskById({ id, completed }));
    TaskSubtaskAPI.update({ id, completed }).catch((e) => {
      toast({
        title: 'TaskSidebar.toggleSubtask',
        description: e.response.data ? e.response.data.message : e.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      dispatch(taskActions.editTaskSubtaskById({ id, completed: !completed }));
    });
  };

  const togglePersonal = () => {
    dispatch(taskActions.setPersonal(!personal));
    if (!task.taskMembers) return;
    const employeeIds: number[] = [];
    for (let i = 0; i < task.taskMembers.length; i++) {
      employeeIds.push(task.taskMembers[i].employee.id);
    }
    dispatch(taskActions.addTaskMembersForDeleteByEmployeeIds(employeeIds));
    dispatch(taskActions.deleteTaskMembers());
  };

  const openCancelModal = () => {
    dispatch(modalActions.openModal({ modal: 'taskCancelModal' }));
  };

  const openTaskSubtasksModal = () => {
    dispatch(modalActions.openModal({ modal: 'taskSubtasksModal' }));
  };

  const taskCompletedRender = () => {
    return task.completed ? (
      <TaskExecutor />
    ) : (
      <>
        <div className={styles.inputs_container}>
          <Button
            leftIcon={<IconCircleCheck size={ICON_SIZE} stroke={ICON_STROKE} />}
            colorScheme="green"
            onClick={completeTask}
          >
            Завершить
          </Button>
          <Textarea
            placeholder="Примечание (необязательно)"
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
          />
        </div>
        <Divider my={4} />
      </>
    );
  };

  const editingRender = () => {
    return (
      <div className={styles.inputs_container}>
        <FormControl flexDirection="row" display="flex" alignItems="center">
          <FormLabel mb={0}>Личное</FormLabel>
          <Switch isChecked={personal} onChange={togglePersonal} />
        </FormControl>
        <FormControl>
          <FormLabel>Заголовок</FormLabel>
          <AutoResizableTextarea
            placeholder="Заголовок"
            value={title}
            onChange={(e) => dispatch(taskActions.setTitle(e.target.value))}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Описание</FormLabel>
          <AutoResizableTextarea
            placeholder="Описание"
            value={description}
            onChange={(e) =>
              dispatch(taskActions.setDescription(e.target.value))
            }
          />
        </FormControl>
        {!personal && (
          <>
            <FormControl>
              <FormLabel>Филиал</FormLabel>
              <Select
                placeholder="Филиал"
                value={shop}
                options={shopsWithGeneral}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                onChange={(option) => dispatch(taskActions.setShop(option))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Отдел</FormLabel>
              <Select
                placeholder="Отдел"
                value={department}
                options={departmentsWithGeneral}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                onChange={(option) =>
                  dispatch(taskActions.setDepartment(option))
                }
              />
            </FormControl>
          </>
        )}
        <Button
          leftIcon={<IconListCheck size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={openTaskSubtasksModal}
        >
          {task.taskSubtasks && task.taskSubtasks.length > 0
            ? `Список подзадач: ${task.taskSubtasks.length}`
            : 'Добавить подзадачи'}
        </Button>
        <FormControl flexDirection="row" display="flex" alignItems="center">
          <FormLabel mb={0}>Срочное</FormLabel>
          <Switch
            isChecked={urgent}
            onChange={() => dispatch(taskActions.setUrgent(!urgent))}
          />
        </FormControl>
      </div>
    );
  };

  const readingRender = () => {
    return (
      <>
        <div className={styles.items}>
          {task.urgent && <Tag colorScheme="red">Срочное</Tag>}
          {personal ? (
            <Tag colorScheme="blue">Личное</Tag>
          ) : (
            <>
              {shop && (
                <div className={styles.item}>
                  <IconBuildingStore className={styles.item_icon} />
                  <Text className={styles.item_text}>{shop.abbreviation}</Text>
                </div>
              )}
              {department && (
                <div className={styles.item}>
                  <IconBinaryTree2 className={styles.item_icon} />
                  <Text className={styles.item_text}>{department.name}</Text>
                </div>
              )}
              <div className={styles.item}>
                <div
                  className={styles.item_text}
                >{`Создатель: ${task.creator?.name} ${task.creator?.surname}`}</div>
              </div>
            </>
          )}
        </div>
        <div>
          <Heading size="md">Заголовок</Heading>
          <Linkify className={styles.text}>{title}</Linkify>
        </div>
        <div>
          <Heading size="md">Описание</Heading>
          <Linkify className={styles.text}>{description}</Linkify>
        </div>
        <div className={styles.subtasks}>
          {task.taskSubtasks?.map((taskSubtask) => (
            <Checkbox
              isChecked={taskSubtask.completed}
              colorScheme="green"
              alignItems="flex-start"
              onChange={(e) => toggleSubtask(taskSubtask.id, e.target.checked)}
              key={taskSubtask.id}
            >
              <Linkify>{taskSubtask.text}</Linkify>
            </Checkbox>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.body} style={!iCreator ? { height: '100%' } : {}}>
        <div>
          {isTaskCreated && taskCompletedRender()}
          <div className={styles.info}>
            {iCreator && !viewMode ? editingRender() : readingRender()}
          </div>
        </div>
      </div>

      {iCreator && (
        <div className={styles.footer}>
          {haveUnsavedData ? (
            <>
              <Tooltip label="Отменить изменения">
                <IconButton
                  icon={<IconRotate2 size={ICON_SIZE} stroke={ICON_STROKE} />}
                  aria-label="cancel"
                  onClick={openCancelModal}
                />
              </Tooltip>
              <Tooltip label="Сохранить">
                <IconButton
                  colorScheme="yellow"
                  icon={
                    <IconDeviceFloppy size={ICON_SIZE} stroke={ICON_STROKE} />
                  }
                  aria-label="save"
                  onClick={() => saveTask(false)}
                />
              </Tooltip>
              <Button
                colorScheme="yellow"
                isDisabled={!haveUnsavedData}
                w="100%"
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
                  <IconButton
                    icon={
                      viewMode ? (
                        <IconPencil size={ICON_SIZE} stroke={ICON_STROKE} />
                      ) : (
                        <IconEye size={ICON_SIZE} stroke={ICON_STROKE} />
                      )
                    }
                    aria-label="view"
                    onClick={() => setViewMode(!viewMode)}
                  />
                </Tooltip>
              )}
              <Button colorScheme="yellow" w="100%" onClick={closeTaskDetail}>
                Выйти
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSidebar;
