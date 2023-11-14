import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { useAppDispatch } from 'hooks/redux';
import { IEmployee } from 'models/api/IEmployee';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const EMPLOYEES_MENU_ID = 'EMPLOYEES_MENU_ID';

const EmployeesContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (employee: IEmployee) => {
    EmployeeAPI.update({ id: employee.id, archive: !employee.archive }).then(
      () => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
      }
    );
  };

  const handleItemClick = (params: ItemParams) => {
    toggleArchive(params.props.row.original);
  };

  const isHidden = (params: ItemParams) => {
    return params.props.row.original.archive;
  };

  return (
    <Menu id={EMPLOYEES_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={handleItemClick}>
        В архив
      </Item>
      <Item
        hidden={(e) => !isHidden(e as ItemParams)}
        onClick={handleItemClick}
      >
        Удалить из архива
      </Item>
    </Menu>
  );
};

export default EmployeesContextMenu;
