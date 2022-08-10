import { IFinishedProduct } from 'models/IFinishedProduct';
import { IOrder } from 'models/IOrder';
import { ISelectedParam } from 'models/ISelectedParam';
import createClone from './createClone';

interface ICreatedFinishedProduct {
  id: number | null;
  productId: number;
  typeId: number;
  orderId: number;
  quantity: number;
  price: number;
  comment: string;
  selectedParams: ISelectedParam[];
}

const createFinishedProductBody = (
  finishedProduct: IFinishedProduct,
  orderId: number
): ICreatedFinishedProduct => {
  const finishedProductCopy: IFinishedProduct = createClone(finishedProduct);

  for (let i = 0; i < finishedProductCopy.selectedParams.length; i++) {
    const selectedParamId =
      typeof finishedProductCopy.selectedParams[i].id === 'string'
        ? null
        : finishedProductCopy.selectedParams[i].id;

    finishedProductCopy.selectedParams[i] = {
      id: selectedParamId,
      param: finishedProductCopy.selectedParams[i].param,
    };
  }

  const finishedProductId =
    typeof finishedProductCopy.id === 'string' ? null : finishedProductCopy.id;

  return {
    id: finishedProductId,
    productId: finishedProductCopy.product.id,
    typeId: finishedProductCopy.type.id,
    orderId: orderId,
    quantity: finishedProductCopy.quantity,
    price: finishedProductCopy.price,
    comment: finishedProductCopy.comment,
    selectedParams: finishedProductCopy.selectedParams,
  };
};

interface IOrderBody {
  id: number;
  userId: number | null;
  statusId: number;
  shopId: number;
  sum: number;
  deadline: string;
  comment: string;
  prepayment: number;
}

interface IOrderInfoBody {
  userId: number;
  statusId: number;
}

interface ICreateOrderBodyForSave {
  (
    finishedProductsForCreate: IFinishedProduct[],
    finishedProductsForUpdate: IFinishedProduct[],
    finishedProductsForDelete: number[],
    order: IOrder,
    sum: number,
    creatorUserId: number,
    activeShopId: number
  ): {
    orderBody: IOrderBody;
    orderInfoBody: IOrderInfoBody;
    finishedProductsForCreateBody: ICreatedFinishedProduct[];
    finishedProductsForUpdateBody: ICreatedFinishedProduct[];
    finishedProductsForDeleteBody: number[];
  };
}

const createOrderBodyForSave: ICreateOrderBodyForSave = (
  finishedProductsForCreate,
  finishedProductsForUpdate,
  finishedProductsForDelete,
  order,
  sum,
  creatorUserId,
  activeShopId
) => {
  
  const orderBody: IOrderBody = {
    id: order.id,
    userId: order.user?.id === undefined ? null : order.user.id,
    statusId: order.status?.id === undefined ? 1 : order.status.id,
    shopId: order.shop?.id === undefined ? activeShopId : order.shop.id,
    sum,
    deadline: order.deadline,
    comment: order.comment,
    prepayment: order.prepayment,
  };

  const orderInfoBody: IOrderInfoBody = {
    userId: creatorUserId,
    statusId: 1,
  };

  const finishedProductsForCreateBody: ICreatedFinishedProduct[] = [];
  finishedProductsForCreate.forEach((finishedProductForCreate) => {
    const createdFinishedProduct = createFinishedProductBody(
      finishedProductForCreate,
      order.id
    );
    finishedProductsForCreateBody.push(createdFinishedProduct);
  });

  const finishedProductsForUpdateBody: ICreatedFinishedProduct[] = [];
  finishedProductsForUpdate.forEach((finishedProductForUpdate) => {
    const createdFinishedProduct = createFinishedProductBody(
      finishedProductForUpdate,
      order.id
    );
    finishedProductsForUpdateBody.push(createdFinishedProduct);
  });

  return {
    orderBody,
    orderInfoBody,
    finishedProductsForCreateBody,
    finishedProductsForUpdateBody,
    finishedProductsForDeleteBody: finishedProductsForDelete,
  };
};

export default createOrderBodyForSave;
