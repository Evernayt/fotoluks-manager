import { Button, SelectButton } from 'components';
import { Modes } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { FC, useMemo, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelCategoriesToolbar.module.css';

interface ControlPanelProductsToolbarProps {
  reload: () => void;
  setLimit: (limit: number) => void;
}

const ControlPanelCategoriesToolbar: FC<ControlPanelProductsToolbarProps> = ({
  reload,
  setLimit,
}) => {
  const limits = useMemo<any>(
    () => [
      {
        id: 1,
        name: '15 категорий',
        value: 15,
      },
      {
        id: 2,
        name: '25 категорий',
        value: 25,
      },
      {
        id: 3,
        name: '50 категорий',
        value: 50,
      },
    ],
    []
  );

  const [selectedLimit, setSelectedLimit] = useState(limits[0]);

  const dispatch = useAppDispatch();

  const selectLimit = (e: any) => {
    setSelectedLimit(e);
    setLimit(e.value);
  };

  const openProductEditModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditCategoryModal({
        categoryId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <Button style={{ width: 'max-content' }} onClick={reload}>
          Обновить
        </Button>
        <Button style={{ width: 'max-content' }} onClick={openProductEditModal}>
          Добавить
        </Button>
      </div>
      <div className={styles.right_section}>
        <SelectButton
          items={limits}
          defaultSelectedItem={selectedLimit}
          changeHandler={selectLimit}
          placement={Placements.bottomEnd}
        />
      </div>
    </div>
  );
};

export default ControlPanelCategoriesToolbar;
