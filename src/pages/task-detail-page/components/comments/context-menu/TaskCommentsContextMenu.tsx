import { ContextMenu } from 'components';
import { useAppDispatch } from 'hooks/redux';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { Item, ItemParams } from 'react-contexify';
import { modalActions } from 'store/reducers/ModalSlice';
import 'react-contexify/ReactContexify.css';
import { IconPencil } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';

export const TASK_DETAIL_COMMENTS_MENU_ID = 'TASK_DETAIL_COMMENTS_MENU_ID';

const TaskCommentsContextMenu = () => {
  const dispatch = useAppDispatch();

  const editComment = (taskMessage: ITaskMessage) => {
    dispatch(
      modalActions.openModal({
        modal: 'taskEditMessageModal',
        props: { taskMessage },
      })
    );
  };

  const handleItemClick = (params: ItemParams) => {
    editComment(params.props.taskMessage);
  };

  return (
    <ContextMenu id={TASK_DETAIL_COMMENTS_MENU_ID}>
      <Item onClick={handleItemClick}>
        <IconPencil
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Изменить
      </Item>
    </ContextMenu>
  );
};

export default TaskCommentsContextMenu;
