import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC, useEffect, useMemo, useState } from 'react';
import { moveSlice } from 'store/reducers/MoveSlice';
import MoveDetailNumCell from './Cells/MoveDetailNumCell';
import MoveDetailMenuCell from './Cells/MoveDetailMenuCell';

interface MoyskladMovesDetailTableProps {
  id?: string;
}

const MoyskladMovesDetailTable: FC<MoyskladMovesDetailTableProps> = ({
  id,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [skipPageReset, setSkipPageReset] = useState(false);

  const positions = useAppSelector((state) => state.move.positions);

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        Cell: ({ row }: any) => Number(row.index) + 1,
      },
      {
        Header: 'Артикул',
        accessor: 'assortment.article',
      },
      {
        Header: 'Код',
        accessor: 'assortment.code',
      },
      {
        Header: 'Наименование',
        accessor: 'assortment',
        Cell: ({ value }: any) => value.name,
        style: { width: '100%' },
      },
      {
        Header: 'Кол-во',
        accessor: 'quantity',
        style: { minWidth: '100px' },
        Cell: MoveDetailNumCell,
      },
      {
        Header: '',
        accessor: 'menu',
        moveId: id,
        Cell: MoveDetailMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchPositions(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setSkipPageReset(false);
  }, [positions]);

  const fetchPositions = (signal?: AbortSignal) => {
    if (!id) return;

    setIsLoading(true);

    MoyskladAPI.getMovePositions({ id }, signal)
      .then((data) => {
        dispatch(moveSlice.actions.setPositions(data.rows));
      })
      .finally(() => setIsLoading(false));
  };

  const updateMyData = (
    index: number,
    _id: string,
    value: string
  ): Promise<any> => {
    setSkipPageReset(true);

    const position = positions[index];

    return MoyskladAPI.editMovePosition({
      id,
      positionID: position.id,
      quantity: Number(value),
    }).then((data) => {
      dispatch(moveSlice.actions.editPosition({ index, position: data }));
    });
  };

  return (
    <>
      <Table
        columns={columns}
        data={positions}
        isLoading={isLoading}
        notFoundText="Пустое перемещение"
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        isHaveToolbar={false}
      />
    </>
  );
};

export default MoyskladMovesDetailTable;
