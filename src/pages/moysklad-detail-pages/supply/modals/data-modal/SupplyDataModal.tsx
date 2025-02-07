import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { FastField, FieldProps, Form, Formik } from 'formik';
import { SelectFormField } from 'components/ui/select/Select';
import { AsyncSelectFormField } from 'components/ui/select/AsyncSelect';
import { AutoResizableTextarea, DatePicker } from 'components';
import { useEffect, useState } from 'react';
import { IStore } from 'models/api/moysklad/IStore';
import { ICustomentity } from 'models/api/moysklad/ICustomentity';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { ISupplyData } from '../../components/data-card/SupplyDataCard';
import * as Yup from 'yup';
import { REQUIRED_INVALID_MSG, MS_DATE_FORMAT } from 'constants/app';
import { supplyActions } from 'store/reducers/SupplySlice';
import { ISupply } from 'models/api/moysklad/ISupply';
import { IAttribute } from 'models/api/moysklad/IAttribute';
import moment from 'moment';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './SupplyDataModal.module.scss';
import { DatePickerFormField } from 'components/ui/date-picker/DatePicker';
import { NumberInputFormField } from 'components/ui/number-input/NumberInput';
import { AutoResizableTextareaFormField } from 'components/ui/auto-resizable-textarea/AutoResizableTextarea';

// const formSchema = Yup.object({
//   agent: Yup.object().required(REQUIRED_INVALID_MSG),
//   store: Yup.object().required(REQUIRED_INVALID_MSG),
// });

const SupplyDataModal = () => {
  const [stores, setStores] = useState<IStore[]>([]);
  const [customentities, setCustomentities] = useState<ICustomentity[]>([]);

  const { isOpen } = useAppSelector((state) => state.modal.supplyDataModal);
  const supplyData = useAppSelector((state) => state.supply.supplyData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm({ values: supplyData });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchStores();
      fetchCustomentities();
    }
  }, [isOpen]);

  const fetchAgents = async (search?: string) => {
    const data = await MoyskladAPI.getCounterparties({ limit: 50, search });
    return data.rows || [];
  };

  const fetchStores = () => {
    MoyskladAPI.getStores().then((data) => {
      setStores(data.rows || []);
    });
  };

  const fetchCustomentities = () => {
    MoyskladAPI.getCustomentities({
      id: '55d291d4-dea1-11e9-0a80-04e10002f4cb',
    }).then((data) => {
      setCustomentities(data.rows || []);
    });
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('supplyDataModal'));
  };

  const submit = (values: ISupplyData) => {
    if (!values.agent || !values.store) return;

    let attributes: IAttribute[] = [
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/2aeeab9c-d926-11e9-0a80-01d100111352',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: '2aeeab9c-d926-11e9-0a80-01d100111352',
        name: 'Оприходовано',
        type: 'boolean',
        value: values.supplied,
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/e16e1b35-cc9a-11ee-0a80-028f0006f6a0',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: 'e16e1b35-cc9a-11ee-0a80-028f0006f6a0',
        name: 'Сумма брака / недостачи',
        type: 'double',
        value: Number(values.defectAmount),
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/94d46d0e-dea1-11e9-0a80-021500035ee7',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: '94d46d0e-dea1-11e9-0a80-021500035ee7',
        name: 'Оплачено',
        type: 'boolean',
        value: values.paid,
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/94d46fbf-dea1-11e9-0a80-021500035ee8',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: '94d46fbf-dea1-11e9-0a80-021500035ee8',
        name: 'Кто приходовал?',
        type: 'customentity',
        value: values.whoSupply,
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/2aeeb10c-d926-11e9-0a80-01d100111355',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: '2aeeb10c-d926-11e9-0a80-01d100111355',
        name: 'Акт возврата брака / недостачи отправлен',
        type: 'boolean',
        value: values.defectActSent,
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/a96e72e6-da1b-11e9-0a80-02d20008f680',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: 'a96e72e6-da1b-11e9-0a80-02d20008f680',
        name: 'Дата оплаты',
        type: 'time',
        value: values.paymentDate
          ? moment(values.paymentDate).format(MS_DATE_FORMAT)
          : null,
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/b3ef4a1e-de9c-11e9-0a80-015400025795',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: 'b3ef4a1e-de9c-11e9-0a80-015400025795',
        name: 'Сумма по накладной',
        type: 'double',
        value: Number(values.invoiceAmount),
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/f4c7deeb-cc9f-11ee-0a80-177f00090b08',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: 'f4c7deeb-cc9f-11ee-0a80-177f00090b08',
        name: 'Дата возврата брака / недостачи',
        type: 'time',
        value: values.defectRefundDate
          ? moment(values.defectRefundDate).format(MS_DATE_FORMAT)
          : null,
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/a96e75c1-da1b-11e9-0a80-02d20008f681',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: 'a96e75c1-da1b-11e9-0a80-02d20008f681',
        name: 'Сумма оплаты',
        type: 'double',
        value: Number(values.paymentAmount),
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/f4c7e212-cc9f-11ee-0a80-177f00090b09',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: 'f4c7e212-cc9f-11ee-0a80-177f00090b09',
        name: 'Количество позиций',
        type: 'long',
        value: Number(values.positionsCount),
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/6380ac8f-cc9b-11ee-0a80-177f0007c432',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: '6380ac8f-cc9b-11ee-0a80-177f0007c432',
        name: 'Сумма учтенного брака / недостачи',
        type: 'double',
        value: Number(values.registeredDefectAmount),
      },
      {
        meta: {
          href: 'https://api.moysklad.ru/api/remap/1.2/entity/supply/metadata/attributes/6380af69-cc9b-11ee-0a80-177f0007c433',
          type: 'attributemetadata',
          mediaType: 'application/json',
        },
        id: '6380af69-cc9b-11ee-0a80-177f0007c433',
        name: 'Сумма неучтенного брака / недостачи',
        type: 'double',
        value: Number(values.unregisteredDefectAmount),
      },
    ];
    attributes = attributes.filter(
      (attribute) =>
        attribute.value !== null &&
        attribute.value !== 0 &&
        attribute.value !== ''
    );

    const supply: Partial<ISupply> = {
      agent: values.agent,
      store: values.store,
      incomingNumber: values.incomingNumber,
      incomingDate: values.incomingDate
        ? moment(values.incomingDate).format(MS_DATE_FORMAT)
        : undefined,
      description: values.description,
      attributes,
    };

    dispatch(supplyActions.setSupply(supply));
    dispatch(supplyActions.setSupplyData(values));

    closeModal();
  };

  const onSubmit: SubmitHandler<ISupplyData> = (values) => {
    console.log(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="full" motionPreset="none">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Данные приемки</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.sections}>
              <div className={styles.section}>
                <FormControl isRequired isInvalid={!!errors.agent}>
                  <FormLabel>Контрагент</FormLabel>
                  <AsyncSelectFormField
                    control={control}
                    name="agent"
                    placeholder="Контрагент"
                    rules={{ required: REQUIRED_INVALID_MSG }}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    loadOptions={(inputValue) => fetchAgents(inputValue)}
                  />
                  <FormErrorMessage>{errors.agent?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.store}>
                  <FormLabel>Склад</FormLabel>
                  <SelectFormField
                    control={control}
                    name="store"
                    placeholder="Склад"
                    rules={{ required: REQUIRED_INVALID_MSG }}
                    options={stores}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                  />
                  <FormErrorMessage>{errors.store?.message}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Входящий номер</FormLabel>
                  <Input
                    {...register('incomingNumber')}
                    placeholder="Входящий номер"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Дата накладной</FormLabel>
                  <DatePickerFormField
                    control={control}
                    name="incomingDate"
                    placeholderText="Дата накладной"
                    isClearable
                  />
                </FormControl>
              </div>
              <div className={styles.section}>
                <FormControl>
                  <FormLabel>Оприходовано</FormLabel>
                  <Switch {...register('supplied')} mb={5} />
                </FormControl>
                <FormControl>
                  <FormLabel>Кто приходовал?</FormLabel>
                  <SelectFormField
                    control={control}
                    name="whoSupply"
                    placeholder="Кто приходовал?"
                    options={customentities}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    isSearchable
                    isClearable
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Сумма по накладной</FormLabel>
                  <NumberInputFormField
                    control={control}
                    name="invoiceAmount"
                    min={0}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Количество позиций</FormLabel>
                  <NumberInputFormField
                    control={control}
                    name="positionsCount"
                    min={0}
                  />
                </FormControl>
              </div>
              <div className={styles.section}>
                <FormControl>
                  <FormLabel>
                    Акт возврата брака / недостачи отправлен
                  </FormLabel>
                  <Switch {...register('defectActSent')} mb={5} />
                </FormControl>
                <FormControl>
                  <FormLabel>Сумма брака / недостачи</FormLabel>
                  <NumberInputFormField
                    control={control}
                    name="defectAmount"
                    min={0}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Дата возврата брака / недостачи</FormLabel>
                  <DatePickerFormField
                    control={control}
                    name="defectRefundDate"
                    placeholderText="Дата возврата брака / недостачи"
                    isClearable
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Сумма учтенного брака / недостачи</FormLabel>
                  <NumberInputFormField
                    control={control}
                    name="registeredDefectAmount"
                    min={0}
                  />
                </FormControl>
              </div>
              <div className={styles.section}>
                <FormControl>
                  <FormLabel>Оплачено</FormLabel>
                  <Switch {...register('paid')} mb={5} />
                </FormControl>
                <FormControl>
                  <FormLabel>Дата оплаты</FormLabel>
                  <DatePickerFormField
                    control={control}
                    name="paymentDate"
                    placeholderText="Дата оплаты"
                    isClearable
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Сумма оплаты</FormLabel>
                  <NumberInputFormField
                    control={control}
                    name="paymentAmount"
                    min={0}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Сумма неучтенного брака / недостачи</FormLabel>
                  <NumberInputFormField
                    control={control}
                    name="unregisteredDefectAmount"
                    min={0}
                  />
                </FormControl>
              </div>
            </div>
            <FormControl>
              <FormLabel>Комментарий</FormLabel>
              <AutoResizableTextareaFormField
                control={control}
                name="description"
                placeholder="Комментарий"
              />
            </FormControl>
            <div className={styles.footer}>
              <Button onClick={closeModal}>Отмена</Button>
              <Button type="submit" colorScheme="yellow">
                Применить
              </Button>
            </div>
          </form>
          {/* <Formik
            initialValues={supplyData}
            validationSchema={formSchema}
            enableReinitialize
            onSubmit={submit}
          >
            {() => (
              <Form className={styles.form}>
                <div className={styles.sections}>
                  <div className={styles.section}>
                    <FastField name="agent">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && meta.touched}>
                          <FormLabel>Контрагент</FormLabel>
                          <AsyncSelectField
                            placeholder="Контрагент"
                            value={meta.value}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                            fieldProps={field}
                            formProps={form}
                            loadOptions={(inputValue) =>
                              fetchAgents(inputValue)
                            }
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="store">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && meta.touched}>
                          <FormLabel>Склад</FormLabel>
                          <SelectField
                            placeholder="Склад"
                            defaultValue={meta.initialValue}
                            options={stores}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option}
                            fieldProps={field}
                            formProps={form}
                            isSearchable
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="incomingNumber">
                      {({ field }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Входящий номер</FormLabel>
                          <Input {...field} placeholder="Входящий номер" />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="incomingDate">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Дата накладной</FormLabel>
                          <DatePicker
                            placeholderText="Дата накладной"
                            startDate={field.value}
                            isClearable
                            onChange={(startDate) =>
                              form.setFieldValue(field.name, startDate)
                            }
                          />
                        </FormControl>
                      )}
                    </FastField>
                  </div>
                  <div className={styles.section}>
                    <FastField name="supplied">
                      {({ field }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Оприходовано</FormLabel>
                          <Switch {...field} mb={5} isChecked={field.value} />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="whoSupply">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Кто приходовал?</FormLabel>
                          <SelectField
                            placeholder="Кто приходовал?"
                            defaultValue={meta.initialValue}
                            options={customentities}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option}
                            fieldProps={field}
                            formProps={form}
                            isSearchable
                          />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="invoiceAmount">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Сумма по накладной</FormLabel>
                          <NumberInput
                            value={field.value}
                            defaultValue={field.value}
                            min={0}
                            onChange={(value) =>
                              form.setFieldValue(field.name, value)
                            }
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="positionsCount">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Количество позиций</FormLabel>
                          <NumberInput
                            value={field.value}
                            defaultValue={field.value}
                            min={0}
                            onChange={(value) =>
                              form.setFieldValue(field.name, value)
                            }
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      )}
                    </FastField>
                  </div>
                  <div className={styles.section}>
                    <FastField name="defectActSent">
                      {({ field }: FieldProps) => (
                        <FormControl>
                          <FormLabel>
                            Акт возврата брака / недостачи отправлен
                          </FormLabel>
                          <Switch {...field} mb={5} isChecked={field.value} />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="defectAmount">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Сумма брака / недостачи</FormLabel>
                          <NumberInput
                            value={field.value}
                            defaultValue={field.value}
                            min={0}
                            onChange={(value) =>
                              form.setFieldValue(field.name, value)
                            }
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="defectRefundDate">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Дата возврата брака / недостачи</FormLabel>
                          <DatePicker
                            placeholderText="Дата возврата брака / недостачи"
                            startDate={field.value}
                            isClearable
                            onChange={(startDate) =>
                              form.setFieldValue(field.name, startDate)
                            }
                          />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="registeredDefectAmount">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>
                            Сумма учтенного брака / недостачи
                          </FormLabel>
                          <NumberInput
                            value={field.value}
                            defaultValue={field.value}
                            min={0}
                            onChange={(value) =>
                              form.setFieldValue(field.name, value)
                            }
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      )}
                    </FastField>
                  </div>
                  <div className={styles.section}>
                    <FastField name="paid">
                      {({ field }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Оплачено</FormLabel>
                          <Switch {...field} mb={5} isChecked={field.value} />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="paymentDate">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Дата оплаты</FormLabel>
                          <DatePicker
                            placeholderText="Дата оплаты"
                            startDate={field.value}
                            isClearable
                            onChange={(startDate) =>
                              form.setFieldValue(field.name, startDate)
                            }
                          />
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="paymentAmount">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Сумма оплаты</FormLabel>
                          <NumberInput
                            value={field.value}
                            defaultValue={field.value}
                            min={0}
                            onChange={(value) =>
                              form.setFieldValue(field.name, value)
                            }
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      )}
                    </FastField>
                    <FastField name="unregisteredDefectAmount">
                      {({ field, form }: FieldProps) => (
                        <FormControl>
                          <FormLabel>
                            Сумма неучтенного брака / недостачи
                          </FormLabel>
                          <NumberInput
                            value={field.value}
                            defaultValue={field.value}
                            min={0}
                            onChange={(value) =>
                              form.setFieldValue(field.name, value)
                            }
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      )}
                    </FastField>
                  </div>
                </div>
                <FastField name="description">
                  {({ field }: FieldProps) => (
                    <FormControl>
                      <FormLabel>Комментарий</FormLabel>
                      <AutoResizableTextarea
                        {...field}
                        placeholder="Комментарий"
                      />
                    </FormControl>
                  )}
                </FastField>
                <div className={styles.footer}>
                  <Button onClick={closeModal}>Отмена</Button>
                  <Button type="submit" colorScheme="yellow">
                    Применить
                  </Button>
                </div>
              </Form>
            )}
          </Formik> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupplyDataModal;
