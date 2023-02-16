import ShopAPI from 'api/ShopAPI/ShopAPI';
import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDotsMenu } from 'icons';
import { IShop } from 'models/api/IShop';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ShopMenuCell = ({ row }: Cell<IShop>) => {
  const dispatch = useAppDispatch();

  const toggleArchive = () => {
    const shop = row.original;
    ShopAPI.update({ id: shop.id, archive: !shop.archive }).then(() => {
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

export default ShopMenuCell;
