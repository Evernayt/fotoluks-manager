import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useEffect } from 'react';
import { supplyTableColumns } from './SupplyTable.colums';
import { useContextMenu } from 'react-contexify';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { useSkipper } from 'hooks';
import { Row } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import SupplyTableContextMenu, {
  SUPPLY_TABLE_MENU_ID,
} from './context-menu/SupplyTableContextMenu';
import { getErrorToast } from 'helpers/toast';
import { supplyActions } from 'store/reducers/SupplySlice';
import styles from './SupplyTable.module.scss';

interface SupplyTableProps {
  id: string | undefined;
  setIsLoading: (isLoading: boolean) => void;
  isDisabled: boolean;
}

const SupplyTable: FC<SupplyTableProps> = ({
  id,
  setIsLoading,
  isDisabled,
}) => {
  const positions = useAppSelector((state) => state.supply.positions);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: SUPPLY_TABLE_MENU_ID });

  useEffect(() => {
    fetchSupplyPositions();
  }, []);

  const fetchSupplyPositions = () => {
    if (!id) return;

    setIsLoading(true);

    MoyskladAPI.getSupplyPositions({
      id,
      expand: 'assortment.productFolder,assortment.supplier',
      fields: 'stock',
    })
      .then((data) => {
        console.log(data);
        dispatch(supplyActions.setPositions(data.rows || []));
      })
      .catch(() => toast(getErrorToast('SupplyTable.fetchSupplyPositions')))
      .finally(() => setIsLoading(false));
  };

  const updateData = (
    _rowIndex: number,
    _columnId: string,
    position: IPosition
  ) => {
    skipAutoResetPageIndex();
    dispatch(supplyActions.editPosition(position));
  };

  const handleContextMenu = (row: Row<IPosition>, event: any) => {
    show({ event, props: { positionId: row.original.id } });
  };

  return (
    <div
      className={[styles.container, isDisabled && styles.disabled].join(' ')}
    >
      <SupplyTableContextMenu />
      <Table
        columns={supplyTableColumns}
        data={[...positions].reverse()}
        notFoundText="Пустая приемка"
        updateData={updateData}
        autoResetPageIndex={autoResetPageIndex}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
};

export default SupplyTable;
