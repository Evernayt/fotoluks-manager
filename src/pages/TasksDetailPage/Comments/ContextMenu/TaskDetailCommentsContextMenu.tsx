import { useAppDispatch } from 'hooks/redux';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { modalSlice } from 'store/reducers/ModalSlice';

export const TASK_DETAIL_COMMENTS_MENU_ID = 'TASK_DETAIL_COMMENTS_MENU_ID';

const TaskDetailCommentsContextMenu = () => {
  const dispatch = useAppDispatch();

  const editComment = (taskMessage: ITaskMessage) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'taskEditMessageModal',
        props: { taskMessage },
      })
    );
  };

  const handleItemClick = (params: ItemParams) => {
    editComment(params.props.taskMessage);
  };

  return (
    <Menu id={TASK_DETAIL_COMMENTS_MENU_ID}>
      <Item onClick={handleItemClick}>Изменить</Item>
    </Menu>
  );
};

export default TaskDetailCommentsContextMenu;
