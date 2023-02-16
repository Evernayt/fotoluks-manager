import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDotsMenu } from 'icons';
import { moveSlice } from 'store/reducers/MoveSlice';

const MoveDetailMenuCell = ({ cell, row }: any) => {
  const dispatch = useAppDispatch();

  const deletePosition = () => {
    const moveId = cell.column.moveId;
    const position = row.original;

    MoyskladAPI.deleteMovePosition({
      id: moveId,
      positionID: position.id,
    }).then(() => {
      dispatch(moveSlice.actions.deletePosition(row.index));
    });
  };

  const menu = [
    {
      id: 1,
      name: 'Удалить',
      onClick: deletePosition,
    },
  ];

  return (
    <DropdownButton
      options={menu}
      placement={Placements.leftStart}
      icon={<IconDotsMenu className="link-icon" />}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default MoveDetailMenuCell;
