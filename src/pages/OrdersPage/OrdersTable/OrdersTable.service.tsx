import { IOrder } from 'models/api/IOrder';

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
