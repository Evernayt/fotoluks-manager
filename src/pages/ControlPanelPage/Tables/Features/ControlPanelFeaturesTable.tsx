import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import ControlPanelFeaturesToolbar from './Toolbar/ControlPanelFeaturesToolbar';
import { IFeature, IFeaturesFilter } from 'models/api/IFeature';
import { useDebounce } from 'hooks';
import FeatureMenuCell from './Cells/FeatureMenuCell';
import FeatureAPI from 'api/FeatureAPI/FeatureAPI';

const ControlPanelFeaturesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [features, setFeatures] = useState<IFeature[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const featuresFilter = useAppSelector(
    (state) => state.controlPanel.featuresFilter
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
        style: { width: '20%' },
      },
      {
        Header: 'Наименование (во мн. ч.)',
        accessor: 'pluralName',
        style: { width: '80%' },
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: FeatureMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchFeatures(page, { ...featuresFilter, search });
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (featuresFilter.isActive) {
      fetchFeatures(page, featuresFilter);
    } else if (featuresFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('featuresFilter'));
      fetchFeatures(page);
    } else if (forceUpdate) {
      fetchFeatures(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchFeatures = (page: number, filter?: IFeaturesFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    FeatureAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setFeatures(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (featuresFilter.isActive) {
      fetchFeatures(page, featuresFilter);
    } else {
      fetchFeatures(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IFeature>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditFeatureModal',
        props: { featureId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <ControlPanelFeaturesToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={features}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default ControlPanelFeaturesTable;
