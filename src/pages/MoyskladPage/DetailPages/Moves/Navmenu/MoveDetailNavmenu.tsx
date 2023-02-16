import { DetailNavmenu } from 'components';
import { DEF_DATE_FORMAT } from 'constants/app';
import { MOYSKLAD_ROUTE } from 'constants/paths';
import { useAppDispatch } from 'hooks/redux';
import moment from 'moment';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { moveSlice } from 'store/reducers/MoveSlice';

interface MoveDetailNavmenuProps {
  date?: string;
}

const MoveDetailNavmenu: FC<MoveDetailNavmenuProps> = ({ date }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const close = () => {
    navigate(MOYSKLAD_ROUTE);
    dispatch(moveSlice.actions.setPositions([]));
  };

  return (
    <DetailNavmenu
      title={
        date
          ? `Перемещение от ${moment(date).format(DEF_DATE_FORMAT)}`
          : 'Новое перемещение'
      }
      onClose={close}
    />
  );
};

export default MoveDetailNavmenu;
