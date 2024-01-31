import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { filterActions } from 'store/reducers/FilterSlice';
import { Row } from '@tanstack/react-table';
import { controlActions } from 'store/reducers/ControlSlice';
import { useContextMenu } from 'react-contexify';
import { IShop, IShopsFilter } from 'models/api/IShop';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import ShopsToolbar from './ShopsToolbar';
import { shopsTableColumns } from './ShopsTable.colums';
import ShopsContextMenu, {
  SHOPS_MENU_ID,
} from './context-menu/ShopsContextMenu';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import { getErrorToast } from 'helpers/toast';

const ShopsTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [shops, setShops] = useState<IShop[]>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const shopsFilter = useAppSelector((state) => state.filter.shopsFilter);
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: SHOPS_MENU_ID });

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (shopsFilter.isActive) {
      reloadAndChangePage(1);
    } else if (shopsFilter.isPendingDeactivation) {
      dispatch(filterActions.deactiveFilter('shopsFilter'));
      fetchShops(currentPage);
    } else if (forceUpdate) {
      fetchShops(currentPage);
    }
    dispatch(controlActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchShops = (page: number, filter?: IShopsFilter) => {
    dispatch(controlActions.setIsLoading(true));

    ShopAPI.getAll({ ...filter, limit, page, search })
      .then((data) => {
        setShops(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) => toast(getErrorToast('ShopsTable.fetchShops', e)))
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    if (shopsFilter.isActive) {
      fetchShops(page, shopsFilter);
    } else {
      fetchShops(page);
    }
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IShop>) => {
    dispatch(
      modalActions.openModal({
        modal: 'shopsEditModal',
        props: { shopId: row.original.id, mode: MODES.EDIT_MODE },
      })
    );
  };

  const handleContextMenu = (row: Row<IShop>, event: any) => {
    show({ event, props: row.original });
  };

  return (
    <>
      <ShopsContextMenu />
      <ShopsToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={shopsTableColumns}
        data={shops}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ShopsTable;
