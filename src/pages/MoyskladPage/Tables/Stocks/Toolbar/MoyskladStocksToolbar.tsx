import { Button, SelectButton, Toolbar } from 'components';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Placements } from 'helpers/calcPlacement';
import { FC, useMemo } from 'react';

interface MoyskladStocksToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const MoyskladStocksToolbar: FC<MoyskladStocksToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
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

  const leftSection = () => {
    return <Button onClick={reload}>Обновить</Button>;
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

export default MoyskladStocksToolbar;
