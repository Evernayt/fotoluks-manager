import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDotsMenu } from 'icons';
import { IEmployee } from 'models/api/IEmployee';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const EmployeeMenuCell = ({ row }: Cell<IEmployee>) => {
  const dispatch = useAppDispatch();

  const toggleArchive = () => {
    const employee = row.original;
    EmployeeAPI.update({ id: employee.id, archive: !employee.archive }).then(
      () => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
      }
    );
  };

  const menu = [
    {
      id: 1,
      name: row.original.archive ? 'Удалить из архива' : 'Добавить в архив',
      onClick: toggleArchive,
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

export default EmployeeMenuCell;
