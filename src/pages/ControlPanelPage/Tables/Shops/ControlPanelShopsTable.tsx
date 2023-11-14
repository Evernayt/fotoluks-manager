import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import ControlPanelShopsToolbar from './Toolbar/ControlPanelShopsToolbar';
import { IShop, IShopsFilter } from 'models/api/IShop';
import { useDebounce } from 'hooks';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { useContextMenu } from 'react-contexify';
import ShopsContextMenu, {
  SHOPS_MENU_ID,
} from './ContextMenu/ShopsContextMenu';

const ControlPanelShopsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [shops, setShops] = useState<IShop[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const shopsFilter = useAppSelector((state) => state.controlPanel.shopsFilter);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Наименование',
        accessor: 'name',
      },
      {
        Header: 'Аббревиатура',
        accessor: 'abbreviation',
      },
      {
        Header: 'Описание',
        accessor: 'description',
        style: { width: '100%' },
      },
      {
        Header: 'Адрес',
        accessor: 'address',
        style: { whiteSpace: 'nowrap' },
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchShops(page, { ...shopsFilter, search });
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (shopsFilter.isActive) {
      fetchShops(page, shopsFilter);
    } else if (shopsFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('shopsFilter'));
      fetchShops(page);
    } else if (forceUpdate) {
      fetchShops(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const { show } = useContextMenu({ id: SHOPS_MENU_ID });

  const handleContextMenu = (row: Row<IShop>, event: any) => {
    show({ event, props: { row } });
  };

  const fetchShops = (page: number, filter?: IShopsFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    ShopAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setShops(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (shopsFilter.isActive) {
      fetchShops(page, shopsFilter);
    } else {
      fetchShops(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IShop>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditShopModal',
        props: { shopId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <ShopsContextMenu />
      <ControlPanelShopsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={shops}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ControlPanelShopsTable;
