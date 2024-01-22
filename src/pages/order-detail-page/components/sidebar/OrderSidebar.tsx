import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderActions } from 'store/reducers/OrderSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
} from '@chakra-ui/react';
import {
  AutoResizableTextarea,
  DatePicker,
  EditableStatNumber,
} from 'components';
import OrderClientSearch from '../client-search/OrderClientSearch';
import OrderClientCard from '../client-card/OrderClientCard';
import { IconWallet } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import styles from './OrderSidebar.module.scss';

interface OrderSidebarProps {
  sum: number;
  saveOrder: () => void;
}

const OrderSidebar: FC<OrderSidebarProps> = ({ sum, saveOrder }) => {
  const [paid, setPaid] = useState<boolean>(false);

  const order = useAppSelector((state) => state.order.order);
  const beforeOrder = useAppSelector((state) => state.order.beforeOrder);
  const user = useAppSelector((state) => state.order.order.user);
  const prepayment = useAppSelector((state) => state.order.order.prepayment);
  const discount = useAppSelector((state) => state.order.order.discount);
  const deadline = useAppSelector((state) => state.order.order.deadline);
  const comment = useAppSelector((state) => state.order.order.comment);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    JSON.stringify(order) == JSON.stringify(beforeOrder)
      ? dispatch(orderActions.setHaveUnsavedData(false))
      : dispatch(orderActions.setHaveUnsavedData(true));
  }, [order]);

  useEffect(() => {
    paidHandler();
  }, [sum, prepayment]);

  const paidHandler = () => {
    prepayment && prepayment > 0 && sum === prepayment
      ? setPaid(true)
      : setPaid(false);
  };

  const openCancelModal = () => {
    dispatch(modalActions.openModal({ modal: 'orderCancelModal' }));
  };

  const clearUser = () => {
    dispatch(orderActions.setOrderUser(null));
    dispatch(orderActions.setDiscount(0));
  };

  const openClientAddModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'orderClientEditModal',
        props: { searchText: '', mode: MODES.ADD_MODE },
      })
    );
  };

  const changeOrderDiscountHandler = (value: string) => {
    const number = Number(value.replace(/[^\d.]/g, ''));
    if (number > 100) return;
    dispatch(orderActions.setDiscount(number));
  };

  return (
    <div className={styles.container}>
      <div className={styles.order_info}>
        <Heading size="md" mb="var(--space-lg)">
          Клиент
        </Heading>
        <OrderClientSearch style={{ marginBottom: 'var(--space-lg)' }} />
        {user ? (
          <OrderClientCard user={user} isEditable={true} onClose={clearUser} />
        ) : (
          <Button minH="35px" onClick={openClientAddModal}>
            Зарегистрировать клиента
          </Button>
        )}
        <Heading size="md" mt="var(--space-xl)" mb="var(--space-lg)">
          О заказе
        </Heading>
        <div className={styles.inputs_container}>
          <div className={styles.sum_container}>
            <Stat>
              <StatLabel>Сумма</StatLabel>
              <StatNumber
                py="0.25rem"
                whiteSpace="nowrap"
              >{`${sum} руб.`}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Скидка</StatLabel>
              <EditableStatNumber
                value={discount.toString()}
                textAfter="%"
                onChange={changeOrderDiscountHandler}
              />
            </Stat>
          </div>
          <div className={styles.paid_container}>
            <FormControl>
              <FormLabel>Предоплата</FormLabel>
              <NumberInput
                value={prepayment}
                placeholder="Предоплата"
                min={0}
                max={sum}
                w="100%"
                onChange={(value) =>
                  dispatch(orderActions.setPrepayment(Number(value)))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            {!paid && (
              <Tooltip label="Оплачено полностью">
                <IconButton
                  icon={<IconWallet size={ICON_SIZE} stroke={ICON_STROKE} />}
                  aria-label="paid"
                  onClick={() => dispatch(orderActions.setPrepayment(sum))}
                />
              </Tooltip>
            )}
          </div>
          {sum > 0 && (
            <Badge textAlign="center" colorScheme={paid ? 'gray' : 'red'}>
              {paid
                ? 'Оплачено полностью'
                : `Остаток: ${sum - prepayment} руб.`}
            </Badge>
          )}
          <FormControl>
            <FormLabel>Срок заказа</FormLabel>
            <DatePicker
              placeholderText="Срок заказа"
              startDate={deadline}
              isClearable
              onChange={(date) => dispatch(orderActions.setDeadline(date))}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Комментарий</FormLabel>
            <AutoResizableTextarea
              placeholder="Комментарий"
              value={comment}
              onChange={(e) =>
                dispatch(orderActions.setComment(e.target.value))
              }
            />
          </FormControl>
        </div>
      </div>
      <div className={styles.footer}>
        {haveUnsavedData && (
          <Button w="100%" onClick={openCancelModal}>
            Отменить
          </Button>
        )}
        <Button
          w="100%"
          colorScheme="yellow"
          isDisabled={!haveUnsavedData}
          onClick={saveOrder}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default OrderSidebar;
