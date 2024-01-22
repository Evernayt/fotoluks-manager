import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { useNavigate } from 'react-router-dom';
import { MOVES_DETAIL_ROUTE } from 'constants/paths';

interface MovesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
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

const MovesToolbar: FC<MovesToolbarProps> = ({ reload, onLimitChange }) => {
  const search = useAppSelector((state) => state.moysklad.search);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchHandler = (search: string) => {
    dispatch(moyskladActions.setSearch(search));
  };

  const newMove = () => {
    navigate(MOVES_DETAIL_ROUTE, {
      state: { moveId: null, created: null },
    });
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          onClick={newMove}
        >
          Новое перемещение
        </Button>
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={reload}
        >
          Обновить
        </Button>
        <Search
          placeholder="Поиск"
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
      <>
        <Select
          options={limitOptions}
          defaultValue={limitOptions[0]}
          onChange={(option) => onLimitChange(option.value)}
        />
      </>
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default MovesToolbar;
