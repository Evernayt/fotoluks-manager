import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { FilterButton, Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { controlActions } from 'store/reducers/ControlSlice';

interface ShopsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 филиалов',
    value: 25,
  },
  {
    label: '50 филиалов',
    value: 50,
  },
  {
    label: '100 филиалов',
    value: 100,
  },
];

const ShopsToolbar: FC<ShopsToolbarProps> = ({ reload, onLimitChange }) => {
  const shopsFilter = useAppSelector((state) => state.filter.shopsFilter);
  const search = useAppSelector((state) => state.control.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(controlActions.setSearch(search));
  };

  const openShopsEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'shopsEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  const openShopsFilterModal = () => {
    dispatch(modalActions.openModal({ modal: 'shopsFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          onClick={openShopsEditModal}
        >
          Добавить
        </Button>
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={() => reload()}
        >
          Обновить
        </Button>
        <Search
          placeholder="Поиск филиалов"
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
        <FilterButton filter={shopsFilter} onClick={openShopsFilterModal} />
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

export default ShopsToolbar;
