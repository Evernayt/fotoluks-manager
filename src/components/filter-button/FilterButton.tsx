import { IconFilter, IconFilterCheck } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IFilter } from 'models/IFilter';
import { IconButton, Tooltip } from '@chakra-ui/react';

interface FilterButtonProps<T extends Partial<IFilter>> {
  filter: T;
  onClick: () => void;
}

const FilterButton = <T extends Partial<IFilter>>({
  filter,
  onClick,
}: FilterButtonProps<T>) => {
  if (filter.isActive) {
    return (
      <Tooltip label="Фильтры включены">
        <IconButton
          icon={<IconFilterCheck size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          aria-label="filter"
          onClick={onClick}
        />
      </Tooltip>
    );
  } else {
    return (
      <IconButton
        icon={<IconFilter size={ICON_SIZE} stroke={ICON_STROKE} />}
        aria-label="filter"
        onClick={onClick}
      />
    );
  }
};

export default FilterButton;
