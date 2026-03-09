import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { IconNumber, IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { modalActions } from 'store/reducers/ModalSlice';

interface RetailshiftsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 смен',
    value: 25,
  },
  {
    label: '50 смен',
    value: 50,
  },
  {
    label: '100 смен',
    value: 100,
  },
];

const RetailshiftsToolbar: FC<RetailshiftsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const search = useAppSelector((state) => state.moysklad.retailshiftsSearch);

  const dispatch = useAppDispatch();

  const openUpdateRetailshiftsModal = () => {
    dispatch(modalActions.openModal({ modal: 'updateRetailshiftsModal' }));
  };

  const searchHandler = (search: string) => {
    dispatch(moyskladActions.setRetailshiftsSearch(search));
  };

  const leftSection = () => {
    return (
      <>
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
        <Button
          leftIcon={<IconNumber size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="gray"
          onClick={openUpdateRetailshiftsModal}
        >
          Изменение номеров
        </Button>
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

export default RetailshiftsToolbar;
