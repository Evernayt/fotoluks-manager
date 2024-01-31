import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlActions } from 'store/reducers/ControlSlice';

interface ReportsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 отзывов',
    value: 25,
  },
  {
    label: '50 отзывов',
    value: 50,
  },
  {
    label: '100 отзывов',
    value: 100,
  },
];

const ReportsToolbar: FC<ReportsToolbarProps> = ({ reload, onLimitChange }) => {
  const search = useAppSelector((state) => state.control.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(controlActions.setSearch(search));
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={() => reload()}
        >
          Обновить
        </Button>
        <Search
          placeholder="Поиск отзывов"
          value={search}
          showResults={false}
          isRound={false}
          onChange={searchHandler}
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

export default ReportsToolbar;
