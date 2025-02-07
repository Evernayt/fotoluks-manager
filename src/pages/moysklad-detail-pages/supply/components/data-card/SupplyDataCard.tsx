import { Card, CardBody } from '@chakra-ui/react';
import { NOT_INDICATED } from 'constants/app';
import { useEffect } from 'react';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';
import { IStore } from 'models/api/moysklad/IStore';
import { getAttributeByName } from 'helpers/moysklad';
import { ICustomentity } from 'models/api/moysklad/ICustomentity';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { supplyActions } from 'store/reducers/SupplySlice';
import SupplyDataItem from './data-item/SupplyDataItem';
import moment from 'moment';
import { modalActions } from 'store/reducers/ModalSlice';
import styles from './SupplyDataCard.module.scss';

export interface ISupplyData {
  agent: ICounterparty | null | undefined;
  store: IStore | null | undefined;
  incomingNumber: string;
  incomingDate: string;
  description: string;
  supplied: boolean;
  whoSupply: ICustomentity | null | undefined;
  invoiceAmount: number;
  positionsCount: number;
  defectAmount: number;
  defectActSent: boolean;
  defectRefundDate: string;
  registeredDefectAmount: number;
  paid: boolean;
  paymentDate: string;
  paymentAmount: number;
  unregisteredDefectAmount: number;
}

export const INITIAL_SUPPLY_DATA: ISupplyData = {
  agent: null,
  store: null,
  incomingNumber: '',
  incomingDate: '',
  description: '',
  supplied: false,
  whoSupply: null,
  invoiceAmount: 0,
  positionsCount: 0,
  defectAmount: 0,
  defectActSent: false,
  defectRefundDate: '',
  registeredDefectAmount: 0,
  paid: false,
  paymentDate: '',
  paymentAmount: 0,
  unregisteredDefectAmount: 0,
};

const SupplyDataCard = () => {
  const supply = useAppSelector((state) => state.supply.supply);
  const supplyData = useAppSelector((state) => state.supply.supplyData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!supplyData.agent) setData();
  }, [supply]);

  const setData = () => {
    if (!supply) return;

    dispatch(
      supplyActions.setSupplyData({
        agent: supply.agent,
        store: supply.store,
        incomingNumber: supply.incomingNumber || '',
        incomingDate: supply.incomingDate || '',
        description: supply.description || '',
        supplied: getAttributeByName('Оприходовано', supply.attributes)?.value,
        whoSupply: getAttributeByName('Кто приходовал?', supply.attributes)
          ?.value,
        invoiceAmount:
          getAttributeByName('Сумма по накладной', supply.attributes)?.value ||
          0,
        positionsCount:
          getAttributeByName('Количество позиций', supply.attributes)?.value ||
          0,
        defectAmount:
          getAttributeByName('Сумма брака / недостачи', supply.attributes)
            ?.value || 0,
        defectActSent: getAttributeByName(
          'Акт возврата брака / недостачи отправлен',
          supply.attributes
        )?.value,
        defectRefundDate:
          getAttributeByName(
            'Дата возврата брака / недостачи',
            supply.attributes
          )?.value || '',
        registeredDefectAmount:
          getAttributeByName(
            'Сумма учтенного брака / недостачи',
            supply.attributes
          )?.value || 0,
        paid: getAttributeByName('Оплачено', supply.attributes)?.value,
        paymentDate:
          getAttributeByName('Дата оплаты', supply.attributes)?.value || '',
        paymentAmount:
          getAttributeByName('Сумма оплаты', supply.attributes)?.value || 0,
        unregisteredDefectAmount:
          getAttributeByName(
            'Сумма неучтенного брака / недостачи',
            supply.attributes
          )?.value || 0,
      })
    );
  };

  const openSupplyDataModal = () => {
    dispatch(modalActions.openModal({ modal: 'supplyDataModal' }));
  };

  return (
    <Card>
      <CardBody className={styles.container} onClick={openSupplyDataModal}>
        <div className={styles.sections}>
          <div>
            <SupplyDataItem
              title="Контрагент"
              value={supplyData?.agent?.name || NOT_INDICATED}
              isRequired={!supplyData?.agent}
            />
            <SupplyDataItem
              title="Склад"
              value={supplyData?.store?.name || NOT_INDICATED}
              isRequired={!supplyData?.store}
            />
            <SupplyDataItem
              title="Входящий номер"
              value={supplyData?.incomingNumber || NOT_INDICATED}
            />
            <SupplyDataItem
              title="Дата накладной"
              value={
                supplyData?.incomingDate
                  ? moment(supplyData?.incomingDate).format('DD.MM.YYYY')
                  : NOT_INDICATED
              }
            />
          </div>
          <div>
            <SupplyDataItem
              title="Оприходовано"
              value={supplyData?.supplied ? 'Да' : 'Нет'}
            />
            <SupplyDataItem
              title="Кто приходовал?"
              value={supplyData?.whoSupply?.name || NOT_INDICATED}
            />
            <SupplyDataItem
              title="Сумма по накладной"
              value={supplyData?.invoiceAmount}
            />
            <SupplyDataItem
              title="Количество позиций"
              value={supplyData?.positionsCount}
            />
          </div>
          <div>
            <SupplyDataItem
              title="Акт возврата брака / недостачи отправлен"
              value={supplyData?.defectActSent ? 'Да' : 'Нет'}
            />
            <SupplyDataItem
              title="Сумма брака / недостачи"
              value={supplyData?.defectAmount}
            />
            <SupplyDataItem
              title="Дата возврата брака / недостачи"
              value={
                supplyData?.defectRefundDate
                  ? moment(supplyData?.defectRefundDate).format('DD.MM.YYYY')
                  : NOT_INDICATED
              }
            />
            <SupplyDataItem
              title="Сумма учтенного брака / недостачи"
              value={supplyData?.registeredDefectAmount}
            />
          </div>
          <div>
            <SupplyDataItem
              title="Оплачено"
              value={supplyData?.paid ? 'Да' : 'Нет'}
            />
            <SupplyDataItem
              title="Дата оплаты"
              value={
                supplyData?.paymentDate
                  ? moment(supplyData?.paymentDate).format('DD.MM.YYYY')
                  : NOT_INDICATED
              }
            />
            <SupplyDataItem
              title="Сумма оплаты"
              value={supplyData?.paymentAmount}
            />
            <SupplyDataItem
              title="Сумма неучтенного брака / недостачи"
              value={supplyData?.unregisteredDefectAmount}
            />
          </div>
        </div>
        <SupplyDataItem
          title="Комментарий"
          value={supplyData.description || NOT_INDICATED}
          maxWidth="100%"
        />
      </CardBody>
    </Card>
  );
};

export default SupplyDataCard;
