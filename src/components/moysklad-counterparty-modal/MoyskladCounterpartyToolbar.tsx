import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';

interface MoyskladCounterpartyToolbarProps {
  reload: () => void;
  search: string;
  onSearchChange: (search: string) => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 контрагентов',
    value: 25,
  },
  {
    label: '50 контрагентов',
    value: 50,
  },
  {
    label: '100 контрагентов',
    value: 100,
  },
];

const MoyskladCounterpartyToolbar: FC<MoyskladCounterpartyToolbarProps> = ({
  reload,
  search,
  onSearchChange,
  onLimitChange,
}) => {
  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={reload}
        >
          Обновить
        </Button>
        <Search
          value={search}
          showResults={false}
          isRound={false}
          onChange={onSearchChange}
        />
      </>
    );
  };

  const rightSection = () => {
    return (
      <Select
        options={limitOptions}
        defaultValue={limitOptions[0]}
        onChange={(option) => onLimitChange(option.value)}
      />
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default MoyskladCounterpartyToolbar;
