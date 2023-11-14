import { IOrder } from 'models/api/IOrder';
import { IOrderInfo } from 'models/api/IOrderInfo';

export const createServicesName = (order: IOrder) => {
  const finishedProducts = order.finishedProducts?.filter(
    (finishedProduct, index, self) =>
      self.findIndex((t) => {
        return t.type?.id === finishedProduct.type?.id;
      }) === index
  );
  const services = finishedProducts
    ?.map(
      (finishedProduct) =>
        `${
          finishedProduct.product?.name
        } ${finishedProduct.type?.name.toLowerCase()}`
    )
    .join(', ');
  return services ? services : 'Нет услуг';
};

export const getEmployeeNameByStatusId = (
  statusId: number,
  orderInfos: IOrderInfo[]
): string => {
  const orderInfoWithStatus = orderInfos.find(
    (orderInfo) => orderInfo.statusId === statusId
  );

  if (orderInfoWithStatus && orderInfoWithStatus.employee) {
    return orderInfoWithStatus.employee.name;
  } else {
    return '';
  }
};
