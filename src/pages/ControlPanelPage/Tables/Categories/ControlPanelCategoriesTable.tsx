import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import ControlPanelCategoriesToolbar from './Toolbar/ControlPanelCategoriesToolbar';
import { ICategoriesFilter, ICategory } from 'models/api/ICategory';
import { useDebounce } from 'hooks';
import CategoryAPI from 'api/CategoryAPI/CategoryAPI';
import { useContextMenu } from 'react-contexify';
import CategoriesContextMenu, {
  CATEGORIES_MENU_ID,
} from './ContextMenu/CategoriesContextMenu';

const ControlPanelCategoriesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const categoriesFilter = useAppSelector(
    (state) => state.controlPanel.categoriesFilter
  );

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
        style: { width: '100%' },
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchCategories(page, { ...categoriesFilter, search });
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (categoriesFilter.isActive) {
      fetchCategories(page, categoriesFilter);
    } else if (categoriesFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('categoriesFilter'));
      fetchCategories(page);
    } else if (forceUpdate) {
      fetchCategories(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const { show } = useContextMenu({ id: CATEGORIES_MENU_ID });

  const handleContextMenu = (row: Row<ICategory>, event: any) => {
    show({ event, props: { row } });
  };

  const fetchCategories = (page: number, filter?: ICategoriesFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    CategoryAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setCategories(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (categoriesFilter.isActive) {
      fetchCategories(page, categoriesFilter);
    } else {
      fetchCategories(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<ICategory>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditCategoryModal',
        props: { categoryId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <CategoriesContextMenu />
      <ControlPanelCategoriesToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={categories}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ControlPanelCategoriesTable;
