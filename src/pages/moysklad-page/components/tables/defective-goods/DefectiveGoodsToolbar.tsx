import { FC } from 'react';
import { Button, IconButton, Tag, Text } from '@chakra-ui/react';
import { IconReceiptRefund, IconRefresh } from '@tabler/icons-react';
import { Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { modalActions } from 'store/reducers/ModalSlice';

interface DefectiveGoodsToolbarProps {
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

const DefectiveGoodsToolbar: FC<DefectiveGoodsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const foundProduct = useAppSelector(
    (state) => state.defectiveGoods.foundProduct
  );
  const search = useAppSelector((state) => state.moysklad.search);

  const dispatch = useAppDispatch();

  const openDefectiveGoodsModal = () => {
    dispatch(modalActions.openModal({ modal: 'defectiveGoodsModal' }));
  };

  const searchHandler = (search: string) => {
    dispatch(moyskladActions.setSearch(search));
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
        <IconButton
          icon={<IconReceiptRefund size={ICON_SIZE} stroke={ICON_STROKE} />}
          aria-label="defectiveGoods"
          onClick={openDefectiveGoodsModal}
        />
        <Search
          placeholder="Поиск по товару"
          value={search}
          showResults={false}
          isRound={false}
          onChange={searchHandler}
        />
        {foundProduct && (
          <Tag colorScheme="yellow">
            <Text
              maxW="300px"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {foundProduct?.name}
            </Text>
          </Tag>
        )}
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

export default DefectiveGoodsToolbar;
