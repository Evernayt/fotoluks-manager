import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateFeatureAPI } from 'http/featureAPI';
import { IconDotsMenu } from 'icons';
import { IFeature } from 'models/IFeature';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const FeatureMenuCell = ({ row }: Cell<IFeature>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const feature = row.original;
    const updatedFeature: IFeature = { ...feature, archive: true };
    updateFeatureAPI(updatedFeature).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const feature = row.original;
    const updatedFeature: IFeature = { ...feature, archive: false };
    updateFeatureAPI(updatedFeature).then(() => {
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
      icon={<IconDotsMenu className="secondary-icon" />}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default FeatureMenuCell;
