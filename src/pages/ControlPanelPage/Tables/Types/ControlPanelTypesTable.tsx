import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ControlPanelTypesToolbar from './Toolbar/ControlPanelTypesToolbar';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import { IType, ITypesFilter } from 'models/api/IType';
import { useDebounce } from 'hooks';
import TypeAPI from 'api/TypeAPI/TypeAPI';
import { useContextMenu } from 'react-contexify';
import TypesContextMenu, {
  TYPES_MENU_ID,
} from './ContextMenu/TypesContextMenu';

const ControlPanelTypesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [types, setTypes] = useState<IType[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const typesFilter = useAppSelector((state) => state.controlPanel.typesFilter);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Продукт',
        accessor: 'product.name',
        style: { width: '20%' },
      },
      {
        Header: 'Тип',
        accessor: 'name',
        style: { width: '80%' },
      },
      {
        Header: 'Категория',
        accessor: 'product.category.name',
      },
      {
        Header: 'Цена',
        accessor: 'price',
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(controlPanelSlice.actions.setDisableFilter(true));
      fetchTypes(page, { search });
    } else {
      dispatch(controlPanelSlice.actions.setDisableFilter(false));
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (typesFilter.isActive) {
      fetchTypes(page, typesFilter);
    } else if (typesFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('typesFilter'));
      fetchTypes(page);
    } else if (forceUpdate) {
      fetchTypes(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const { show } = useContextMenu({ id: TYPES_MENU_ID });

  const handleContextMenu = (row: Row<IType>, event: any) => {
    show({ event, props: { row } });
  };

  const fetchTypes = (page: number, filter?: ITypesFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    TypeAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setTypes(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (typesFilter.isActive) {
      fetchTypes(page, typesFilter);
    } else {
      fetchTypes(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IType>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditTypeModal',
        props: { typeId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <TypesContextMenu />
      <ControlPanelTypesToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={types}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ControlPanelTypesTable;
