import { useAppDispatch } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import { controlActions } from 'store/reducers/ControlSlice';
import { ContextMenu } from 'components';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { IEmployee } from 'models/api/IEmployee';
import 'react-contexify/ReactContexify.css';
import { IconArchive } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';

export const EMPLOYEES_MENU_ID = 'EMPLOYEES_MENU_ID';

const EmployeesContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (params: ItemParams<IEmployee>) => {
    const employee = params.props;
    if (!employee) return;
    EmployeeAPI.update({ id: employee.id, archive: !employee.archive }).then(
      () => {
        dispatch(controlActions.setForceUpdate(true));
      }
    );
  };

  const isHidden = (params: ItemParams<IEmployee>) => {
    return params.props?.archive || false;
  };

  return (
    <ContextMenu id={EMPLOYEES_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={toggleArchive}>
        <IconArchive
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        В архив
      </Item>
      <Item hidden={(e) => !isHidden(e as ItemParams)} onClick={toggleArchive}>
        <IconArchive
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Удалить из архива
      </Item>
    </ContextMenu>
  );
};

export default EmployeesContextMenu;
