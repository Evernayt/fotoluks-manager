import FeatureAPI from 'api/FeatureAPI/FeatureAPI';
import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDotsMenu } from 'icons';
import { IFeature } from 'models/api/IFeature';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const FeatureMenuCell = ({ row }: Cell<IFeature>) => {
  const dispatch = useAppDispatch();

  const toggleArchive = () => {
    const feature = row.original;
    FeatureAPI.update({ id: feature.id, archive: !feature.archive }).then(
      () => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
      }
    );
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

export default FeatureMenuCell;
