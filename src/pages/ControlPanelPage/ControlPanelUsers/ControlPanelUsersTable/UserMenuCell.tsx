import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateUserAPI } from 'http/userAPI';
import { IconDotsMenu } from 'icons';
import { IUser } from 'models/IUser';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const UserMenuCell = ({ row }: Cell<IUser>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const user = row.original;
    const updatedUser: IUser = { ...user, archive: true };
    updateUserAPI(updatedUser).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const user = row.original;
    const updatedUser: IUser = { ...user, archive: false };
    updateUserAPI(updatedUser).then(() => {
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
      icon={<IconDotsMenu className="secondary-icon" />}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default UserMenuCell;
