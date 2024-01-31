import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useEffect } from 'react';
import { moveTableColumns } from './MoveTable.colums';
import { useContextMenu } from 'react-contexify';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { moveActions } from 'store/reducers/MoveSlice';
import { useSkipper } from 'hooks';
import { Row } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import MoveTableContextMenu, {
  MOVE_TABLE_MENU_ID,
} from './context-menu/MoveTableContextMenu';
import { getErrorToast } from 'helpers/toast';
import styles from './MoveTable.module.scss';

interface MoveTableProps {
  id: string | undefined;
  setIsLoading: (isLoading: boolean) => void;
  isDisabled: boolean;
}

const MoveTable: FC<MoveTableProps> = ({ id, setIsLoading, isDisabled }) => {
  const positions = useAppSelector((state) => state.move.positions);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: MOVE_TABLE_MENU_ID });

  useEffect(() => {
    fetchMovePositions();
  }, []);

  const fetchMovePositions = () => {
    if (!id) return;

    setIsLoading(true);
    MoyskladAPI.getMovePositions({ id })
      .then((data) => {
        dispatch(moveActions.setPositions(data.rows || []));
      })
      .catch(() => toast(getErrorToast('MoveTable.fetchMovePositions')))
      .finally(() => setIsLoading(false));
  };

  const updateData = (
    rowIndex: number,
    _columnId: string,
    value: any
  ): Promise<any> => {
    skipAutoResetPageIndex();

    if (!id) throw new Error();

    const position = positions[rowIndex];
    return MoyskladAPI.editMovePosition({
      id,
      positionId: position.id,
      quantity: Number(value),
    })
      .then((data) => {
        dispatch(moveActions.editPosition({ rowIndex, position: data }));
      })
      .catch(() => toast(getErrorToast('MoveTable.updateData')));
  };

  const handleContextMenu = (row: Row<IPosition>, event: any) => {
    show({
      event,
      props: { position: row.original, rowIndex: row.index, moveId: id },
    });
  };

  return (
    <div
      className={[styles.container, isDisabled && styles.disabled].join(' ')}
    >
      <MoveTableContextMenu />
      <Table
        columns={moveTableColumns}
        data={positions}
        notFoundText="Пустое перемещение"
        updateData={updateData}
        autoResetPageIndex={autoResetPageIndex}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
};

export default MoveTable;
