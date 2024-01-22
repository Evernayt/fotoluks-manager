import { FC } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { FilterButton, Search, Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { IconMoysklad } from 'icons';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import { controlActions } from 'store/reducers/ControlSlice';

interface ProductsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 услуг',
    value: 25,
  },
  {
    label: '50 услуг',
    value: 50,
  },
  {
    label: '100 услуг',
    value: 100,
  },
];

const ProductsToolbar: FC<ProductsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const productsFilter = useAppSelector((state) => state.filter.productsFilter);
  const search = useAppSelector((state) => state.control.search);
  const isLoading = useAppSelector((state) => state.control.isLoading);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const searchHandler = (search: string) => {
    dispatch(controlActions.setSearch(search));
  };

  const openProductsEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'productsEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  const syncAllFromMoysklad = () => {
    dispatch(controlActions.setIsLoading(true));
    ProductAPI.syncAll()
      .then(() => {
        dispatch(controlActions.setForceUpdate(true));
      })
      .catch((e) =>
        toast({
          title: 'ProductsToolbar.syncAllFromMoysklad',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const openProductsFilterModal = () => {
    dispatch(modalActions.openModal({ modal: 'productsFilterModal' }));
  };

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
          colorScheme="yellow"
          onClick={openProductsEditModal}
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
          placeholder="Поиск услуг"
          value={search}
          showResults={false}
          isRound={false}
          onChange={searchHandler}
        />
        <Button
          leftIcon={<IconMoysklad size={ICON_SIZE} stroke={ICON_STROKE} />}
          isLoading={isLoading}
          onClick={syncAllFromMoysklad}
        >
          Синхронизировать все
        </Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <FilterButton
          filter={productsFilter}
          onClick={openProductsFilterModal}
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

export default ProductsToolbar;
