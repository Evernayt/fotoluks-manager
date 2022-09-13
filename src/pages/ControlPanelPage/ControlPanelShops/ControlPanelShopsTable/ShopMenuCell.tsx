import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateShopAPI } from 'http/shopAPI';
import { IconDotsMenu } from 'icons';
import { IShop } from 'models/IShop';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ShopMenuCell = ({ row }: Cell<IShop>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const shop = row.original;
    const updatedShop: IShop = { ...shop, archive: true };
    updateShopAPI(updatedShop).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const shop = row.original;
    const updatedShop: IShop = { ...shop, archive: false };
    updateShopAPI(updatedShop).then(() => {
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

export default ShopMenuCell;
