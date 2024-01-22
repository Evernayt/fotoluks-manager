import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { FilterButton, Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { controlActions } from 'store/reducers/ControlSlice';

interface EmployeesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 сотрудников',
    value: 25,
  },
  {
    label: '50 сотрудников',
    value: 50,
  },
  {
    label: '100 сотрудников',
    value: 100,
  },
];

const EmployeesToolbar: FC<EmployeesToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const employeesFilter = useAppSelector(
    (state) => state.filter.employeesFilter
  );
  const search = useAppSelector((state) => state.control.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(controlActions.setSearch(search));
  };

  const openEmployeesEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'employeesEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  const openEmployeesFilterModal = () => {
    dispatch(modalActions.openModal({ modal: 'employeesFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          onClick={openEmployeesEditModal}
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
          placeholder="Поиск сотрудников"
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
        <FilterButton
          filter={employeesFilter}
          onClick={openEmployeesFilterModal}
        />
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

export default EmployeesToolbar;
