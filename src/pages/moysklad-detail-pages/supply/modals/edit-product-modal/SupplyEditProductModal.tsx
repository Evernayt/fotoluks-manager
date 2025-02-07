import {
  Button,
  Divider,
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
import { REQUIRED_INVALID_MSG } from 'constants/app';
import { AsyncSelectFormField } from 'components/ui/select/AsyncSelect';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { IProductFolder } from 'models/api/moysklad/IProductFolder';
import { ISupplier } from 'models/api/moysklad/ISupplier';
import { getOldPrice, getSellingPrice } from 'helpers/moysklad';
import { IBarcode } from 'models/api/moysklad/IBarcode';
import SupplyBarcodesFormField from './barcodes-field/SupplyBarcodesFormField';
import SupplyProductTabs from './product-tabs/SupplyProductTabs';
import { useForm, SubmitHandler } from 'react-hook-form';
import { NumberInputFormField } from 'components/ui/number-input/NumberInput';
import styles from './SupplyEditProductModal.module.scss';

interface FormValues {
  name: string;
  minimumBalance: string;
  productFolder: IProductFolder | null;
  supplier: ISupplier | null;
  article: string;
  code: string;
  buyPrice: string;
  salePrice: string;
  oldPrice: string;
  discountProhibited: boolean;
  description: string;
  barcodes: IBarcode[];
}

const SupplyEditProductModal = () => {
  const { isOpen, position } = useAppSelector(
    (state) => state.modal.supplyEditProductModal
  );

  const assortment = position?.assortment;

  const INITIAL_FORM_STATE: FormValues = {
    name: assortment?.name || '',
    minimumBalance: assortment?.minimumBalance?.toString() || '0',
    productFolder: assortment?.productFolder || null,
    supplier: assortment?.supplier || null,
    article: assortment?.article || '',
    code: assortment?.code || '',
    buyPrice: ((assortment?.buyPrice?.value || 0) / 100).toString(),
    salePrice: (
      (getSellingPrice(assortment?.salePrices || []).salePrice?.value || 0) /
      100
    ).toString(),
    oldPrice: (
      (getOldPrice(assortment?.salePrices || []).salePrice?.value || 0) / 100
    ).toString(),
    discountProhibited: assortment?.discountProhibited || false,
    description: assortment?.description || '',
    barcodes: assortment?.barcodes || [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({ values: INITIAL_FORM_STATE });

  const dispatch = useAppDispatch();

  const fetchProductFolders = async (search?: string) => {
    const data = await MoyskladAPI.getProductFolders({ limit: 50, search });
    return data.rows || [];
  };

  const fetchSuppliers = async (search?: string) => {
    const data = await MoyskladAPI.getCounterparties({ limit: 50, search });
    return data.rows || [];
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('supplyEditProductModal'));
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="full" motionPreset="none">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование товара</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.header}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Наименование товара</FormLabel>
                <Input
                  {...register('name', { required: REQUIRED_INVALID_MSG })}
                  placeholder="Наименование товара"
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl maxW="max-content">
                <FormLabel>Неснижаемый остаток</FormLabel>
                <NumberInput
                  value={watch('minimumBalance')}
                  min={0}
                  onChange={(value) => {
                    setValue('minimumBalance', value);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </div>
            <Divider my={4} />
            <div className={styles.main}>
              <div>
                <div className={styles.sections}>
                  <div className={styles.section}>
                    <FormControl>
                      <FormLabel>Группа</FormLabel>
                      <AsyncSelectFormField
                        control={control}
                        name="productFolder"
                        placeholder="Группа"
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        loadOptions={(inputValue) =>
                          fetchProductFolders(inputValue)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Поставщик</FormLabel>
                      <AsyncSelectFormField
                        control={control}
                        name="supplier"
                        placeholder="Поставщик"
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        loadOptions={(inputValue) => fetchSuppliers(inputValue)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Артикул</FormLabel>
                      <Input {...register('article')} placeholder="Артикул" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Артикул</FormLabel>
                      <Input {...register('code')} placeholder="Код" />
                    </FormControl>
                  </div>
                  <div className={styles.small_section}>
                    <FormControl maxW="max-content">
                      <FormLabel>Закупочная цена</FormLabel>
                      <NumberInputFormField
                        control={control}
                        name="buyPrice"
                        min={0}
                      />
                    </FormControl>
                    <FormControl maxW="max-content">
                      <FormLabel>Цена продажи</FormLabel>
                      <NumberInputFormField
                        control={control}
                        name="salePrice"
                        min={0}
                      />
                    </FormControl>
                    <FormControl maxW="max-content">
                      <FormLabel>Старая цена</FormLabel>
                      <NumberInputFormField
                        control={control}
                        name="oldPrice"
                        min={0}
                      />
                    </FormControl>
                    <FormControl maxW="max-content">
                      <FormLabel>Запретить скидки</FormLabel>
                      <Switch {...register('discountProhibited')} mb={5} />
                    </FormControl>
                  </div>
                </div>
                <FormControl>
                  <FormLabel>Описание</FormLabel>
                  <Textarea
                    {...register('description')}
                    placeholder="Описание"
                    h="154px"
                    resize="none"
                  />
                </FormControl>
              </div>
              <div>
                <Divider orientation="vertical" />
              </div>
              <div>
                <FormControl>
                  <FormLabel>Штрихкоды товара</FormLabel>
                  <SupplyBarcodesFormField
                    barcodes={watch('barcodes')}
                    onChange={(barcodes) => setValue('barcodes', barcodes)}
                  />
                </FormControl>
              </div>
              <div>
                <Divider orientation="vertical" />
              </div>
              <SupplyProductTabs assortment={assortment} />
            </div>
            <div className={styles.footer}>
              <Button onClick={closeModal}>Отмена</Button>
              <Button type="submit" colorScheme="yellow">
                Применить
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupplyEditProductModal;
