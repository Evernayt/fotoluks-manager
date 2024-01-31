import { useAppDispatch, useAppSelector } from 'hooks/redux';
import XLSX from 'xlsx-js-style';
import moment from 'moment';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { createServicesName } from 'pages/orders-page/components/table/OrdersTable.service';
import { SHOP_INVALID_MSG, UI_DATE_FORMAT } from 'constants/app';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { SelectField } from 'components/ui/select/Select';
import { DatePicker } from 'components';
import * as Yup from 'yup';
import { getEmployeeFullName } from 'helpers/employee';
import { getInfoToast } from 'helpers/toast';
import styles from './OrdersExportModal.module.scss';

interface FormValues {
  shopId: number | null;
  dates: {
    startDate: string;
    endDate: string;
  };
}

const INITIAL_FORM_STATE: FormValues = {
  shopId: null,
  dates: {
    startDate: '',
    endDate: '',
  },
};

const formSchema = Yup.object({
  shopId: Yup.number().min(1, SHOP_INVALID_MSG).required(SHOP_INVALID_MSG),
});

const OrdersExportModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.ordersExportModal);
  const shops = useAppSelector((state) => state.app.shops);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const closeModal = () => {
    dispatch(modalActions.closeModal('ordersExportModal'));
  };

  const rowContains = (array: any[], elememnt: any): number => {
    for (let index = 0; index < array.length; index++) {
      if (array[index][4] === elememnt) {
        return index;
      }
    }
    return -1;
  };

  const createExcelFile = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const {
      shopId,
      dates: { startDate, endDate },
    } = values;

    const excelData: any[] = [];
    const employees: any[] = [[]];

    if (!shopId) return;
    OrderAPI.getAllForExport({
      startDate,
      endDate,
      shopId,
    })
      .then((data) => {
        if (!data.length) {
          toast(getInfoToast('Заказов в этот период нет.'));
          return;
        }

        for (let index = 0; index < data.length; index++) {
          const order = data[index];

          const services = createServicesName(order.orderProducts || []);

          let employee = 'Ошибка';
          let status = 'Ошибка';
          if (order.orderInfos && order.orderInfos.length) {
            employee =
              order.orderInfos.length > 0
                ? getEmployeeFullName(order.orderInfos[0].employee)
                : employee;
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
            'Дата заказа': moment(order.createdAt).format(UI_DATE_FORMAT),
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

        const fileName = `Заказы с ${startDate} по ${
          endDate || new Date().toISOString()
        }.xlsx`;

        XLSX.writeFile(workbook, fileName);
        closeModal();
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Экспорт в XLSX</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={INITIAL_FORM_STATE}
            validationSchema={formSchema}
            onSubmit={createExcelFile}
          >
            {(props) => (
              <Form className={styles.form}>
                <Field name="shopId">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Филиал</FormLabel>
                      <SelectField
                        placeholder="Филиал"
                        options={shops}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        fieldProps={field}
                        formProps={form}
                        isDisabled={form.isSubmitting}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field
                  name="dates"
                  validate={({ startDate }: FormValues['dates']) =>
                    Yup.string()
                      .required()
                      .validate(startDate)
                      .then(() => '')
                      .catch(() => 'Нужно указать дату')
                  }
                >
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Дата заказа</FormLabel>
                      <DatePicker
                        placeholderText="Дата заказа"
                        startDate={field.value.startDate}
                        endDate={field.value.endDate}
                        selectsRange
                        isClearable
                        disabled={form.isSubmitting}
                        onChange={(startDate, endDate) =>
                          form.setFieldValue(field.name, { startDate, endDate })
                        }
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  className={styles.export_button}
                  isLoading={props.isSubmitting}
                  type="submit"
                  colorScheme="yellow"
                >
                  Экспортировать
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrdersExportModal;
