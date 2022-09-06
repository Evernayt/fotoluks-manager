import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateProductAPI } from 'http/productAPI';
import { dotsMenuIcon } from 'icons';
import { IProduct } from 'models/IProduct';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ProductMenuCell = ({ row }: Cell<IProduct>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const product = row.original;
    const updatedProduct: IProduct = { ...product, archive: true };
    updateProductAPI(updatedProduct).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const product = row.original;
    const updatedProduct: IProduct = { ...product, archive: false };
    updateProductAPI(updatedProduct).then(() => {
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

export default ProductMenuCell;
