import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateUserAPI } from 'http/userAPI';
import { dotsMenuIcon } from 'icons';
import { IUser } from 'models/IUser';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const UserMenuCell = ({ row }: Cell<IUser>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const user = row.original;
    const updatedUser: IUser = { ...user, archive: 1 };
    updateUserAPI(updatedUser).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const user = row.original;
    const updatedUser: IUser = { ...user, archive: 0 };
    updateUserAPI(updatedUser).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const userMenu = [
    {
      id: 1,
      name:
        row.original.archive === 0 ? 'Добавить в архив' : 'Удалить из архива',
      onClick: row.original.archive === 0 ? addToArchive : deleteFromArchive,
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

export default UserMenuCell;
