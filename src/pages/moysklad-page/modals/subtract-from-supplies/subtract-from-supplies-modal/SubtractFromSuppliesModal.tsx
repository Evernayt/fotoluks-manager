import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IPosition } from 'models/api/moysklad/IPosition';
import { modalActions } from 'store/reducers/ModalSlice';
import { getErrorToast } from 'helpers/toast';
import SubtractFromSuppliesMovesTable from './SubtractFromSuppliesMovesTable';
import XLSX from 'xlsx-js-style';
import { IMove } from 'models/api/moysklad/IMove';

const SubtractFromSuppliesModal = () => {
  const { isOpen, id, name } = useAppSelector(
    (state) => state.modal.subtractFromSuppliesModal
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  const createData = (moveId: string) => {
    MoyskladAPI.getSupplyPositions({ id, expand: 'assortment' })
      .then((supplyData) => {
        const supplyPositions = supplyData.rows || [];

        MoyskladAPI.getMove(moveId)
          .then((move) => {
            MoyskladAPI.getMovePositions({ id: moveId })
              .then((moveData) => {
                const movePositions = moveData.rows || [];

                const resultData = supplyPositions
                  .map((supplyPosition) => {
                    const movePosition = movePositions.find(
                      (position) =>
                        position.assortment?.id ===
                        supplyPosition.assortment?.id
                    );
                    if (movePosition) {
                      const newQuantity =
                        supplyPosition.quantity - movePosition.quantity;
                      return newQuantity > 0
                        ? { ...supplyPosition, quantity: newQuantity }
                        : null;
                    }
                    return { ...supplyPosition };
                  })
                  .filter((position) => position !== null);

                createExcelFile(resultData, move);
              })
              .catch(() =>
                toast(
                  getErrorToast('SubtractFromSuppliesModal.getMovePositions')
                )
              );
          })
          .catch(() =>
            toast(getErrorToast('SubtractFromSuppliesModal.getMove'))
          );
      })
      .catch(() =>
        toast(getErrorToast('SubtractFromSuppliesModal.getSupplyPositions'))
      );
  };

  const createExcelFile = (resultData: IPosition[], move: IMove) => {
    const excelData = resultData.map((data, index) => {
      return {
        '№': index + 1,
        Артикул: data.assortment?.article,
        Код: data.assortment?.code,
        'Наименование товара': data.assortment?.name,
        Количество: data.quantity,
      };
    });

    const workbook = XLSX.utils.book_new();

    const sheetName = `Накладная №${name}`;
    const title = `Накладная №${name} за вычетом перемещения №${move.name}`;

    const worksheetData: any[][] = [[title], []];

    worksheetData.push(Object.keys(excelData[0] || {}));
    worksheetData.push(...excelData.map((row) => Object.values(row)));

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const range = XLSX.utils.decode_range(worksheet['!ref']!);

    worksheet['A1'].s = {
      font: { name: 'Arial', sz: 9, bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
      worksheet[cellAddress].s = {
        font: { name: 'Arial', sz: 9, bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
    }

    for (let row = 3; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) {
          // Если ячейка пустая, создаём её
          worksheet[cellAddress] = { v: '' };
        }
        worksheet[cellAddress].s = {
          font: { name: 'Arial', sz: 9 },
          alignment: { vertical: 'center' },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        };
      }
    }

    if (!worksheet['!merges']) {
      worksheet['!merges'] = [];
    }
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });

    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 10 },
      { wch: 8 },
      { wch: 50 },
      { wch: 10 },
    ];

    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = worksheet;

    const fileName = `${title}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('subtractFromSuppliesModal'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Выберите перемещение, которое нужно вычесть из приемки №${name}`}</ModalHeader>
        <ModalCloseButton />
        <SubtractFromSuppliesMovesTable onCreateFileClick={createData} />
      </ModalContent>
    </Modal>
  );
};

export default SubtractFromSuppliesModal;
