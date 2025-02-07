import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconFilePlus, IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { RowSelectionState } from '@tanstack/react-table';

interface SubtractFromSuppliesMovesToolbarProps {
  isLoading: boolean;
  reload: () => void;
  search: string;
  selectedMoves: RowSelectionState;
  onSearchChange: (search: string) => void;
  onLimitChange: (limit: number) => void;
  onCreateFileClick: (moveId: string) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 позиций',
    value: 25,
  },
  {
    label: '50 позиций',
    value: 50,
  },
  {
    label: '100 позиций',
    value: 100,
  },
];

const SubtractFromSuppliesMovesToolbar: FC<
  SubtractFromSuppliesMovesToolbarProps
> = ({
  isLoading,
  reload,
  search,
  selectedMoves,
  onSearchChange,
  onLimitChange,
  onCreateFileClick,
}) => {
  const selectedLength = Object.keys(selectedMoves).length;

  const createFileClickHandler = () => {
    onCreateFileClick(Object.keys(selectedMoves)[0]);
  };

  const leftSection = () => {
    return (
      <>
        {selectedLength > 0 && (
          <Button
            leftIcon={<IconFilePlus size={ICON_SIZE} stroke={ICON_STROKE} />}
            isLoading={isLoading}
            colorScheme="yellow"
            onClick={createFileClickHandler}
          >
            {`Вычесть и создать файл: ${Object.keys(selectedMoves).length}`}
          </Button>
        )}
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={() => reload()}
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

export default SubtractFromSuppliesMovesToolbar;
