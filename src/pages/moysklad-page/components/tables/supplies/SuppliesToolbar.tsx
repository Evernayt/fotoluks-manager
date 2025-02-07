import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { useNavigate } from 'react-router-dom';
import { SUPPLY_DETAIL_ROUTE } from 'constants/paths';

interface SuppliesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 приемок',
    value: 25,
  },
  {
    label: '50 приемок',
    value: 50,
  },
  {
    label: '100 приемок',
    value: 100,
  },
];

const SuppliesToolbar: FC<SuppliesToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const search = useAppSelector((state) => state.moysklad.suppliesSearch);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchHandler = (search: string) => {
    dispatch(moyskladActions.setSuppliesSearch(search));
  };

  const newSupply = () => {
    navigate(SUPPLY_DETAIL_ROUTE, {
      state: { supplyId: null, created: null },
    });
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          onClick={newSupply}
        >
          Новая приемка
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

export default SuppliesToolbar;
