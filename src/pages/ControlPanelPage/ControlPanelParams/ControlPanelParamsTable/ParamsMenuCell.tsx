import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateParamAPI } from 'http/paramAPI';
import { dotsMenuIcon } from 'icons';
import { IParam } from 'models/IParam';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ParamsMenuCell = ({ row }: Cell<IParam>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const param = row.original;
    const updatedParam: IParam = { ...param, archive: true };
    updateParamAPI(updatedParam).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const param = row.original;
    const updatedParam: IParam = { ...param, archive: false };
    updateParamAPI(updatedParam).then(() => {
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

export default ParamsMenuCell;
