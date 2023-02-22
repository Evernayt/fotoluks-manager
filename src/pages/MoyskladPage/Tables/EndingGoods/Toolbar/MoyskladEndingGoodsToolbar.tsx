import { Button, SelectButton, Toolbar } from 'components';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface MoyskladEndingGoodsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const MoyskladEndingGoodsToolbar: FC<MoyskladEndingGoodsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const dispatch = useAppDispatch();

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '25 позиций',
        value: 25,
      },
      {
        id: 2,
        name: '50 позиций',
        value: 50,
      },
      {
        id: 3,
        name: '100 позиций',
        value: 100,
      },
    ],
    []
  );

  const openClearOrderedModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'endingGoodsClearOrderedModal' })
    );
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={openClearOrderedModal}>Очистить заказанное</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <SelectButton
          items={limitItems}
          defaultSelectedItem={limitItems[0]}
          onChange={(item) => onLimitChange(item.value)}
          placement={Placements.bottomEnd}
        />
      </>
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default MoyskladEndingGoodsToolbar;
