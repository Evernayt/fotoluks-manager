import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { FilterButton, Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { controlActions } from 'store/reducers/ControlSlice';

interface UsersToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 клиентов',
    value: 25,
  },
  {
    label: '50 клиентов',
    value: 50,
  },
  {
    label: '100 клиентов',
    value: 100,
  },
];

const UsersToolbar: FC<UsersToolbarProps> = ({ reload, onLimitChange }) => {
  const usersFilter = useAppSelector((state) => state.filter.usersFilter);
  const search = useAppSelector((state) => state.control.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(controlActions.setSearch(search));
  };

  const openUsersEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'usersEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  const openUsersFilterModal = () => {
    dispatch(modalActions.openModal({ modal: 'usersFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          onClick={openUsersEditModal}
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
          placeholder="Поиск клиентов"
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
        <FilterButton filter={usersFilter} onClick={openUsersFilterModal} />
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

export default UsersToolbar;
