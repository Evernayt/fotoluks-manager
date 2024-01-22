import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconRefresh } from '@tabler/icons-react';
import { FilterButton, Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { taskActions } from 'store/reducers/TaskSlice';

interface TasksToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 задач',
    value: 25,
  },
  {
    label: '50 задач',
    value: 50,
  },
  {
    label: '100 задач',
    value: 100,
  },
];

const TasksToolbar: FC<TasksToolbarProps> = ({ reload, onLimitChange }) => {
  const tasksFilter = useAppSelector((state) => state.filter.tasksFilter);
  const search = useAppSelector((state) => state.task.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(taskActions.setSearch(search));
  };

  const openTasksFilterModal = () => {
    dispatch(modalActions.openModal({ modal: 'tasksFilterModal' }));
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
          placeholder="Поиск задач"
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
        <FilterButton filter={tasksFilter} onClick={openTasksFilterModal} />
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

export default TasksToolbar;
