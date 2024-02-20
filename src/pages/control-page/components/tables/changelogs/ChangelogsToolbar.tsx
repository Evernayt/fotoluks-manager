import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlActions } from 'store/reducers/ControlSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import { checkAccessByRole } from 'helpers/employee';

interface ChangelogsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 версий',
    value: 25,
  },
  {
    label: '50 версий',
    value: 50,
  },
  {
    label: '100 версий',
    value: 100,
  },
];

const ChangelogsToolbar: FC<ChangelogsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const search = useAppSelector((state) => state.control.search);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(controlActions.setSearch(search));
  };

  const openChangelogsEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'changelogsEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  const leftSection = () => {
    return (
      <>
        {checkAccessByRole(employee, 'Разработчик') && (
          <Button
            leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
            colorScheme="yellow"
            onClick={openChangelogsEditModal}
          >
            Добавить
          </Button>
        )}
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={() => reload()}
        >
          Обновить
        </Button>
        <Search
          placeholder="Поиск изменений"
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

export default ChangelogsToolbar;
