import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { DetailNavbar } from 'components';
import moment from 'moment';
import { UI_DATE_FORMAT } from 'constants/app';
import { MOYSKLAD_ROUTE } from 'constants/paths';
import { moveActions } from 'store/reducers/MoveSlice';

interface MoveNavbarProps {
  date: string | undefined;
  onClose: () => void;
}

const MoveNavbar: FC<MoveNavbarProps> = ({ date, onClose }) => {
  const title = date
    ? `Перемещение от ${moment(date).format(UI_DATE_FORMAT)}`
    : 'Новое перемещение';

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeMoveDetail = () => {
    navigate(MOYSKLAD_ROUTE);
    dispatch(moveActions.setPositions([]));
    onClose();
  };

  return <DetailNavbar title={title} onClose={closeMoveDetail} />;
};

export default MoveNavbar;
