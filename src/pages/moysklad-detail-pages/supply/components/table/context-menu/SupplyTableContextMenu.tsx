import { useAppDispatch } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { ContextMenu } from 'components';
import { IconTrash } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';
import { supplyActions } from 'store/reducers/SupplySlice';

export const SUPPLY_TABLE_MENU_ID = 'SUPPLY_TABLE_MENU_ID';

export interface ISupplyTableContextMenuProps {
  positionId: string;
}

const SupplyTableContextMenu = () => {
  const dispatch = useAppDispatch();

  const deletePosition = (params: ItemParams<ISupplyTableContextMenuProps>) => {
    const props = params.props;
    if (!props?.positionId) return;

    dispatch(supplyActions.deletePosition(props.positionId));
  };

  return (
    <ContextMenu id={SUPPLY_TABLE_MENU_ID}>
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

export default SupplyTableContextMenu;
