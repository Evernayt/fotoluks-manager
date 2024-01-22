import { Avatar, Button, IconButton, Tooltip } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconUserPlus } from '@tabler/icons-react';
import { modalActions } from 'store/reducers/ModalSlice';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './OrderMembersSidebar.module.scss';

const OrderMembersSidebar = () => {
  const orderMembers = useAppSelector(
    (state) => state.order.order.orderMembers
  );

  const dispatch = useAppDispatch();

  const openMembersModal = () => {
    dispatch(modalActions.openModal({ modal: 'orderMembersModal' }));
  };

  return (
    <div className={styles.container}>
      {orderMembers && (
        <>
          {orderMembers.map((orderMember, index) =>
            index > 7 ? null : (
              <Tooltip
                label={getEmployeeFullName(orderMember.employee)}
                placement="left"
                key={orderMember.id}
              >
                <Avatar
                  name={getEmployeeFullName(orderMember.employee)}
                  src={orderMember.employee.avatar || undefined}
                />
              </Tooltip>
            )
          )}
          {orderMembers.length > 8 && (
            <Button
              minH="42px"
              minW="42px"
              maxH="42px"
              maxW="42px"
              borderRadius={9999}
              onClick={openMembersModal}
            >
              {`+${orderMembers.length - 8}`}
            </Button>
          )}
        </>
      )}
      <Tooltip label="Добавить участников" placement="left">
        <IconButton
          icon={<IconUserPlus />}
          aria-label="add"
          isRound
          minH="42px"
          minW="42px"
          maxH="42px"
          maxW="42px"
          onClick={openMembersModal}
        />
      </Tooltip>
    </div>
  );
};

export default OrderMembersSidebar;
