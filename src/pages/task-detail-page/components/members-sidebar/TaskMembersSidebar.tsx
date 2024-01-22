import { Avatar, Button, IconButton, Tooltip } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconUserPlus } from '@tabler/icons-react';
import { modalActions } from 'store/reducers/ModalSlice';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './TaskMembersSidebar.module.scss';

const TaskMembersSidebar = () => {
  const taskMembers = useAppSelector((state) => state.task.task.taskMembers);

  const dispatch = useAppDispatch();

  const openMembersModal = () => {
    dispatch(modalActions.openModal({ modal: 'taskMembersModal' }));
  };

  return (
    <div className={styles.container}>
      {taskMembers && (
        <>
          {taskMembers.map((taskMember, index) =>
            index > 7 ? null : (
              <Tooltip
                label={getEmployeeFullName(taskMember.employee)}
                placement="left"
                key={taskMember.id}
              >
                <Avatar
                  name={getEmployeeFullName(taskMember.employee)}
                  src={taskMember.employee.avatar || undefined}
                />
              </Tooltip>
            )
          )}
          {taskMembers.length > 8 && (
            <Button
              minH="42px"
              minW="42px"
              maxH="42px"
              maxW="42px"
              borderRadius={9999}
              onClick={openMembersModal}
            >
              {`+${taskMembers.length - 8}`}
            </Button>
          )}
        </>
      )}
      <Tooltip label="Добавить участников" placement="left">
        <IconButton
          icon={<IconUserPlus />}
          aria-label="add"
          isRound
          minH="42px"
          minW="42px"
          maxH="42px"
          maxW="42px"
          onClick={openMembersModal}
        />
      </Tooltip>
    </div>
  );
};

export default TaskMembersSidebar;
