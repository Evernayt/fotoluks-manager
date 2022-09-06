import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateTypeAPI } from 'http/typeAPI';
import { dotsMenuIcon } from 'icons';
import { IType } from 'models/IType';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const TypeMenuCell = ({ row }: Cell<IType>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const type = row.original;
    const updatedType: IType = { ...type, archive: true };
    updateTypeAPI(updatedType, []).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const type = row.original;
    const updatedType: IType = { ...type, archive: false };
    updateTypeAPI(updatedType, []).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const userMenu = [
    {
      id: 1,
      name: row.original.archive ? 'Удалить из архива' : 'Добавить в архив',
      onClick: row.original.archive ? deleteFromArchive : addToArchive,
    },
  ];

  return (
    <DropdownButton
      options={userMenu}
      placement={Placements.leftStart}
      icon={dotsMenuIcon}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default TypeMenuCell;
