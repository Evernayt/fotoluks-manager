import ParamAPI from 'api/ParamAPI/ParamAPI';
import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDotsMenu } from 'icons';
import { IParam } from 'models/api/IParam';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ParamsMenuCell = ({ row }: Cell<IParam>) => {
  const dispatch = useAppDispatch();

  const toggleArchive = () => {
    const param = row.original;
    ParamAPI.update({ id: param.id, archive: !param.archive }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const userMenu = [
    {
      id: 1,
      name: row.original.archive ? 'Удалить из архива' : 'Добавить в архив',
      onClick: toggleArchive,
    },
  ];

  return (
    <DropdownButton
      options={userMenu}
      placement={Placements.leftStart}
      icon={<IconDotsMenu className="link-icon" />}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default ParamsMenuCell;
