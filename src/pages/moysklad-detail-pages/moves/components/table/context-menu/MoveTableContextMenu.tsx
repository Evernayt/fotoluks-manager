import { useAppDispatch } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { ContextMenu } from 'components';
import { IconTrash } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IPosition } from 'models/api/moysklad/IPosition';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { moveActions } from 'store/reducers/MoveSlice';

export const MOVE_TABLE_MENU_ID = 'MOVE_TABLE_MENU_ID';

export interface IMoveTableContextMenuProps {
  position: IPosition;
  rowIndex: number;
  moveId: string;
}

const MoveTableContextMenu = () => {
  const dispatch = useAppDispatch();

  const deletePosition = (params: ItemParams<IMoveTableContextMenuProps>) => {
    const props = params.props;
    if (!props) return;

    MoyskladAPI.deleteMovePosition({
      id: props.moveId,
      positionId: props.position.id,
    }).then(() => {
      dispatch(moveActions.deletePosition(props.rowIndex));
    });
  };

  return (
    <ContextMenu id={MOVE_TABLE_MENU_ID}>
      <Item onClick={deletePosition}>
        <IconTrash
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Удалить
      </Item>
    </ContextMenu>
  );
};

export default MoveTableContextMenu;
