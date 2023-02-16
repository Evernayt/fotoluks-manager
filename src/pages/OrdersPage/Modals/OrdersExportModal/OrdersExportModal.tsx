import {
  Button,
  DropdownButton,
  Modal,
  SelectButton,
  Textbox,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import XLSX from 'xlsx-js-style';
import styles from './OrdersExportModal.module.scss';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { DEF_DATE_FORMAT, INPUT_DATE_FORMAT } from 'constants/app';
import { IShop } from 'models/api/IShop';
import { modalSlice } from 'store/reducers/ModalSlice';
import { INITIAL_SHOP } from 'constants/states/shop-states';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { createServicesName } from 'pages/OrdersPage/OrdersTable/OrdersTable.service';

const OrdersExportModal = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(INITIAL_SHOP);

  const ordersExportModal = useAppSelector(
    (state) => state.modal.ordersExportModal
  );

  const dispatch = useAppDispatch();

  const periods = useMemo(
    () => [
      {
        id: 1,
        name: 'Текущий месяц',
        onClick: () => {
          const start = moment().startOf('month').format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment().endOf('month').format(INPUT_DATE_FORMAT);
          setEndDate(end);
        },
      },
      {
        id: 2,
        name: 'Предыдущий месяц',
        onClick: () => {
          const start = moment()
            .subtract(1, 'month')
            .startOf('month')
            .format(INPUT_DATE_FORMAT);
          setStartDate(start);

          const end = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(INPUT_DATE_FORMAT);
          setEndDate(end);
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (ordersExportModal.isShowing) {
      setError('');
      setSelectedShop(INITIAL_SHOP);
      fetchShops();

      const start = moment()
        .subtract(1, 'month')
        .startOf('month')
        .format(INPUT_DATE_FORMAT);
      setStartDate(start);

      const end = moment()
        .subtract(1, 'month')
        .endOf('month')
        .format(INPUT_DATE_FORMAT);
      setEndDate(end);
    }
  }, [ordersExportModal.isShowing]);

  const fetchShops = () => {
    ShopAPI.getAll().then((data) => {
      setShops(data.rows);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('ordersExportModal'));
  };

  const rowContains = (array: any[], elememnt: any): number => {
    for (let index = 0; index < array.length; index++) {
      if (array[index][4] === elememnt) {
        return index;
      }
    }
    return -1;
  };

  const createExcelFile = () => {
    const excelData: any[] = [];
    const employees: any[] = [[]];

    OrderAPI.getAllForExport({
      startDate,
      endDate,
      shopId: selectedShop.id,
    }).then((data) => {
      if (!data.length) {
        setError('Заказов в этот период нет.');
        return;
      }

      setError('');

      for (let index = 0; index < data.length; index++) {
        const order = data[index];

        const services = createServicesName(order);

        let employee = 'Ошибка';
        let status = 'Ошибка';
        if (order.orderInfos && order.orderInfos.length) {
          employee = order.orderInfos[0].employee?.name || employee;
          status =
            order.orderInfos[order.orderInfos.length - 1].status?.name ||
            status;
        }

        const employeeIndex = rowContains(employees, employee);

        if (employeeIndex === -1) {
          employees.push([null, null, null, order.sum, employee, null]);
        } else {
          employees[employeeIndex][3] += order.sum;
        }

        excelData.push({
          '№': order.id,
          'Дата заказа': moment(order.createdAt).format(DEF_DATE_FORMAT),
          Услуги: services,
          Сумма: order.sum,
          'Кто создал': employee,
          'Конечный статус': status,
        });
      }

      const workbook = XLSX.utils.book_new();
      workbook.SheetNames.push('Orders');
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      employees[1][1] = 'ИТОГО';

      XLSX.utils.sheet_add_aoa(worksheet, employees, {
        origin: -1,
      });

      const border = {
        top: {
          style: 'thin',
          color: '000000',
        },
        bottom: {
          style: 'thin',
          color: '000000',
        },
        left: {
          style: 'thin',
          color: '000000',
        },
        right: {
          style: 'thin',
          color: '000000',
        },
      };

      for (const key in worksheet) {
        if (typeof worksheet[key] != 'object') continue;

        const cell = XLSX.utils.decode_cell(key);

        worksheet[key].s = {
          font: {
            name: 'Arial',
            sz: 10,
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border,
        };

        if (cell.c == 2) {
          worksheet[key].s = {
            font: {
              name: 'Arial',
              sz: 10,
            },
            alignment: {
              vertical: 'center',
              wrapText: true,
            },
            border,
          };
        }

        if (cell.r == 0) {
          worksheet[key].s = {
            font: {
              name: 'Arial',
              sz: 10,
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            },
            border,
          };
        }
      }

      const range = XLSX.utils.decode_range(worksheet['!ref']!);
      const rowsCount = range.e.r + 1;
      const colsCount = range.e.c + 1;

      const rows = [];
      for (let index = 0; index < rowsCount; index++) {
        rows.push({ hpx: 30 });
      }
      worksheet['!rows'] = rows;

      const cols = [];
      for (let index = 0; index < colsCount; index++) {
        if (index === 0) {
          cols.push({ wch: 10 });
        } else if (index === 2) {
          cols.push({ wch: 50 });
        } else {
          cols.push({ wch: 20 });
        }
      }
      worksheet['!cols'] = cols;
      workbook.Sheets['Orders'] = worksheet;

      XLSX.writeFile(workbook, `Заказы с ${startDate} по ${endDate}.xlsx`);
      close();
    });
  };

  return (
    <Modal
      title="Экспорт в XLSX"
      isShowing={ordersExportModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <SelectButton
          items={shops}
          defaultSelectedItem={selectedShop}
          onChange={(e) => setSelectedShop(e)}
        />
        <DropdownButton text="Период" options={periods} />
        <Textbox
          label="От"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Textbox
          label="До"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className={styles.error}>{error}</div>
      </div>
      <Button
        variant={ButtonVariants.primary}
        onClick={createExcelFile}
        disabled={selectedShop.id === 0}
      >
        Экспортировать
      </Button>
    </Modal>
  );
};

export default OrdersExportModal;
