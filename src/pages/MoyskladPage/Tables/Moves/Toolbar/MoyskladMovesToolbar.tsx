import { Button, SelectButton, Toolbar } from 'components';
import { ISelectItem } from 'components/UI/SelectButton/SelectButton.types';
import { MOVES_DETAIL_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDepartment } from 'models/api/IDepartment';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { moveSlice } from 'store/reducers/MoveSlice';

interface MoyskladMovesToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const MoyskladMovesToolbar: FC<MoyskladMovesToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const employee = useAppSelector((state) => state.employee.employee);

  const limitItems = useMemo<ISelectItem[]>(
    () => [
      {
        id: 1,
        name: '25 позиций',
        value: 25,
      },
      {
        id: 2,
        name: '50 позиций',
        value: 50,
      },
      {
        id: 3,
        name: '100 позиций',
        value: 100,
      },
    ],
    []
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const departmentChangeHandler = (department: IDepartment) => {
    dispatch(moveSlice.actions.setDepartment(department));
  };

  const newMove = () => {
    navigate(MOVES_DETAIL_ROUTE, {
      state: { moveId: undefined, created: undefined },
    });
  };

  const leftSection = () => {
    return (
      <>
        <Button onClick={reload}>Обновить</Button>
        <Button onClick={newMove}>Новое перемещение</Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        {employee?.departments && employee.departments.length > 1 && (
          <SelectButton
            title="Отдел"
            items={employee.departments}
            defaultSelectedItem={employee.departments[0]}
            onChange={departmentChangeHandler}
            placement={Placements.bottomEnd}
            tooltipProps={{ delay: 800 }}
          />
        )}
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

export default MoyskladMovesToolbar;
