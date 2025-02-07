import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { DetailNavbar } from 'components';
import moment from 'moment';
import { UI_DATE_FORMAT } from 'constants/app';
import { MOYSKLAD_ROUTE } from 'constants/paths';
import socketio from 'socket/socketio';
import { supplyActions } from 'store/reducers/SupplySlice';

interface SupplyNavbarProps {
  date: string | undefined;
  onClose: () => void;
}

const SupplyNavbar: FC<SupplyNavbarProps> = ({ date, onClose }) => {
  const employee = useAppSelector((state) => state.employee.employee);

  const title = date
    ? `Приемка от ${moment(date).format(UI_DATE_FORMAT)}`
    : 'Новая приемка';

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeSupplyDetail = () => {
    navigate(MOYSKLAD_ROUTE);
    dispatch(supplyActions.clearSupply());
    onClose();

    // if (!employee) return;
    // socketio.removeMoveEditor(employee.id);
  };

  return <DetailNavbar title={title} onClose={closeSupplyDetail} />;
};

export default SupplyNavbar;
