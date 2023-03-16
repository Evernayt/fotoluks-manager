import { Button, SelectButton, Toolbar, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useMemo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';

interface TasksToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const TasksToolbar: FC<TasksToolbarProps> = ({ reload, onLimitChange }) => {
  const filter = useAppSelector((state) => state.task.filter);
  const disableFilter = useAppSelector((state) => state.task.disableFilter);

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '15 задач',
        value: 15,
      },
      {
        id: 2,
        name: '25 задач',
        value: 25,
      },
      {
        id: 3,
        name: '50 задач',
        value: 50,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();

  const openTasksFilterModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'tasksFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Tooltip label="Фильтры включены" disabled={!filter.isActive}>
          <Button
            style={{ width: 'max-content' }}
            onClick={openTasksFilterModal}
            variant={
              filter.isActive
                ? ButtonVariants.primaryDeemphasized
                : ButtonVariants.default
            }
            disabled={disableFilter}
          >
            Фильтры
          </Button>
        </Tooltip>

        <SelectButton
          items={limitItems}
          defaultSelectedItem={limitItems[0]}
          onChange={(item) => onLimitChange(item.value)}
          placement={Placements.bottomEnd}
        />
      </>
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default TasksToolbar;
