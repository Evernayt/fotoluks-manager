import { IOrderInfo } from 'models/api/IOrderInfo';
import { IOrderProduct } from 'models/api/IOrderProduct';

export const createServicesName = (orderProducts: IOrderProduct[]) => {
  const orderProductsWithoutDupl = orderProducts?.filter(
    (orderProduct, index, self) =>
      self.findIndex((t) => {
        return t.product?.id === orderProduct.product?.id;
      }) === index
  );
  const services = orderProductsWithoutDupl
    ?.map((orderProduct) => orderProduct.product?.name)
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
