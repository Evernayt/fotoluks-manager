import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { updateCategoryAPI } from 'http/categoryAPI';
import { dotsMenuIcon } from 'icons';
import { ICategory } from 'models/ICategory';
import { Cell } from 'react-table';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const CategoryMenuCell = ({ row }: Cell<ICategory>) => {
  const dispatch = useAppDispatch();

  const addToArchive = () => {
    const category = row.original;
    const updatedCategory: ICategory = { ...category, archive: true };
    updateCategoryAPI(updatedCategory).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const deleteFromArchive = () => {
    const category = row.original;
    const updatedCategory: ICategory = { ...category, archive: false };
    updateCategoryAPI(updatedCategory).then(() => {
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

export default CategoryMenuCell;
