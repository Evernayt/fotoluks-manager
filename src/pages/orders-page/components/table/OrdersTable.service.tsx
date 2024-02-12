import { IOrderInfo } from 'models/api/IOrderInfo';
import { IOrderProduct } from 'models/api/IOrderProduct';

export const createServicesName = (orderProducts: IOrderProduct[]) => {
  const MAX_SERVICES = 2;
  const services = [];
  const orderProductsLenght = orderProducts.length;
  for (let i = 0; i < orderProductsLenght; i++) {
    if (i === MAX_SERVICES && orderProductsLenght > MAX_SERVICES) {
      services.push('...');
      break;
    }
    services.push(orderProducts[i].product?.name);
  }
  return services.length ? services.join(', ') : 'Нет услуг';
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
