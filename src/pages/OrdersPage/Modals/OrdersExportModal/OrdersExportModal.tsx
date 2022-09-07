import {
  Button,
  DropdownButton,
  Modal,
  SelectButton,
  Textbox,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchOrdersForExportAPI } from 'http/orderAPI';
import XLSX from 'xlsx-js-style';
import styles from './OrdersExportModal.module.css';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { INPUT_FORMAT } from 'constants/app';
import { Placements } from 'helpers/calcPlacement';
import { IShop } from 'models/IShop';
import { fetchShopsAPI } from 'http/shopAPI';
import { modalSlice } from 'store/reducers/ModalSlice';

const OrdersExportModal = () => {
  const initialShop: IShop = {
    id: 0,
    name: 'Выберите филиал',
    address: '',
    description: '',
  };

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(initialShop);

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
          const start = moment().startOf('month').format(INPUT_FORMAT);
          setStartDate(start);

          const end = moment().endOf('month').format(INPUT_FORMAT);
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
            .format(INPUT_FORMAT);
          setStartDate(start);

          const end = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(INPUT_FORMAT);
          setEndDate(end);
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (ordersExportModal.isShowing) {
      setError('');
      setSelectedShop(initialShop);
      fetchShops();

      const start = moment()
        .subtract(1, 'month')
        .startOf('month')
        .format(INPUT_FORMAT);
      setStartDate(start);

      const end = moment()
        .subtract(1, 'month')
        .endOf('month')
        .format(INPUT_FORMAT);
      setEndDate(end);
    }
  }, [ordersExportModal.isShowing]);

  const fetchShops = () => {
    fetchShopsAPI().then((data) => {
      setShops(data.rows);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeOrdersExportModal());
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
    const users: any[] = [[]];

    fetchOrdersForExportAPI(startDate, endDate, selectedShop.id).then(
      (data) => {
        if (data.length === 0) {
          setError('Заказов в этот период нет.');
          return;
        }

        setError('');

        for (let index = 0; index < data.length; index++) {
          const order = data[index];

          const finishedProducts = order.finishedProducts
            .filter(
              (elem, index, self) =>
                self.findIndex((t) => {
                  return t.type.id === elem.type.id;
                }) === index
            )
            .map(
              (element) =>
                `${element.product.name} ${element.type.name.toLowerCase()}`
            )
            .join(', ');

          const user =
            order.orderInfos.length > 0
              ? order.orderInfos[0].user.name
              : 'Ошибка';

          const userIndex = rowContains(users, user);

          if (userIndex === -1) {
            users.push([null, null, null, order.sum, user, null]);
          } else {
            users[userIndex][3] += order.sum;
          }

          excelData.push({
            '№': order.id,
            'Дата заказа': moment(order.createdAt).format('DD.MM.YYY HH:mm'),
            Услуги: finishedProducts,
            Сумма: order.sum,
            'Кто создал': user,
            'Конечный статус':
              order.orderInfos.length > 0
                ? order.orderInfos[order.orderInfos.length - 1].status.name
                : 'Ошибка',
          });
        }

        const workbook = XLSX.utils.book_new();
        workbook.SheetNames.push('Orders');
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        users[1][1] = 'ИТОГО';

        XLSX.utils.sheet_add_aoa(worksheet, users, {
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
      }
    );
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
          changeHandler={(e) => setSelectedShop(e)}
          style={{ width: '100%', marginBottom: '12px' }}
        />
        <DropdownButton
          text="Период"
          options={periods}
          placement={Placements.bottomStart}
        />
        <Textbox
          label="От"
          type="datetime-local"
          containerStyle={{ margin: '24px 0 12px 0' }}
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
      <div className={styles.controls}>
        <Button
          variant={ButtonVariants.primary}
          onClick={createExcelFile}
          disabled={selectedShop.id === 0}
        >
          Экспортировать
        </Button>
      </div>
    </Modal>
  );
};

export default OrdersExportModal;
