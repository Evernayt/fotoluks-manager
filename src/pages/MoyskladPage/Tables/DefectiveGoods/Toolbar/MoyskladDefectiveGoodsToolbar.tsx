import { Button, SelectButton, Toolbar } from 'components';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './MoyskladDefectiveGoodsToolbar.module.scss';

interface MoyskladDefectiveGoodsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const MoyskladDefectiveGoodsToolbar: FC<MoyskladDefectiveGoodsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const foundProduct = useAppSelector(
    (state) => state.defectiveGoods.foundProduct
  );

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '25 приемок',
        value: 25,
      },
      {
        id: 2,
        name: '50 приемок',
        value: 50,
      },
      {
        id: 3,
        name: '100 приемок',
        value: 100,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openDefectiveGoodsModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'defectiveGoodsModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openDefectiveGoodsModal}>Товары на возврат</Button>
        {foundProduct && (
          <div className={styles.product_name}>
            <b>Товар: </b>
            {foundProduct?.name}
          </div>
        )}
      </>
    );
  };

  const rightSection = () => {
    return (
      <SelectButton
        items={limitItems}
        defaultSelectedItem={limitItems[0]}
        onChange={(item) => onLimitChange(item.value)}
        placement={Placements.bottomEnd}
      />
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default MoyskladDefectiveGoodsToolbar;
