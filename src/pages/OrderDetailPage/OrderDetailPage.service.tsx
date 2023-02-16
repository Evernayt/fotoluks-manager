import { createClone } from 'helpers';
import { IFinishedProduct } from 'models/api/IFinishedProduct';
import { IOrder } from 'models/api/IOrder';
import { IOrderMember } from 'models/api/IOrderMember';
import { ISelectedParam } from 'models/api/ISelectedParam';

export interface ICreatedFinishedProduct {
  id: number | null;
  orderId: number;
  quantity: number;
  price: number;
  comment: string;
  folder: string;
  selectedParams?: ISelectedParam[];
  productId?: number;
  typeId?: number;
}

export interface ICreatedOrderMember {
  id: null;
  employeeId: number;
}

export interface IOrderBody {
  id: number;
  userId: number | null;
  statusId: number;
  shopId: number;
  sum: number;
  deadline: string;
  comment: string;
  prepayment: number;
}

export interface IOrderInfoBody {
  employeeId: number;
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
    activeShopId: number,
    orderMembersForCreate: IOrderMember[],
    orderMembersForDelete: number[]
  ): {
    orderBody: IOrderBody;
    orderInfoBody: IOrderInfoBody;
    finishedProductsForCreateBody: ICreatedFinishedProduct[];
    finishedProductsForUpdateBody: ICreatedFinishedProduct[];
    finishedProductsForDeleteBody: number[];
    orderMembersForCreateBody: ICreatedOrderMember[];
    orderMembersForDeleteBody: number[];
  };
}

const createFinishedProductBody = (
  finishedProduct: IFinishedProduct,
  orderId: number
): ICreatedFinishedProduct => {
  const finishedProductCopy: IFinishedProduct = createClone(finishedProduct);

  if (finishedProductCopy.selectedParams) {
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
  }

  const finishedProductId =
    typeof finishedProductCopy.id === 'string' ? null : finishedProductCopy.id;

  return {
    id: finishedProductId,
    productId: finishedProductCopy.product?.id,
    typeId: finishedProductCopy.type?.id,
    orderId: orderId,
    quantity: finishedProductCopy.quantity,
    price: finishedProductCopy.price,
    comment: finishedProductCopy.comment,
    folder: finishedProductCopy.folder,
    selectedParams: finishedProductCopy.selectedParams,
  };
};

export const createOrderBodyForSave: ICreateOrderBodyForSave = (
  finishedProductsForCreate,
  finishedProductsForUpdate,
  finishedProductsForDelete,
  order,
  sum,
  creatorEmployeeId,
  activeShopId,
  orderMembersForCreate,
  orderMembersForDelete
) => {
  const orderBody: IOrderBody = {
    id: order.id,
    userId: order.user?.id ? order.user.id : null,
    statusId: order.status?.id ? order.status.id : 1,
    shopId: order.shop?.id ? order.shop.id : activeShopId,
    sum,
    deadline: order.deadline,
    comment: order.comment,
    prepayment: order.prepayment,
  };

  const orderInfoBody: IOrderInfoBody = {
    employeeId: creatorEmployeeId,
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

  const orderMembersForCreateBody: ICreatedOrderMember[] = [];
  orderMembersForCreate.forEach((orderMemberForCreate) => {
    const createdOrderMember: ICreatedOrderMember = {
      id: null,
      employeeId: orderMemberForCreate.employee.id,
    };
    orderMembersForCreateBody.push(createdOrderMember);
  });

  return {
    orderBody,
    orderInfoBody,
    finishedProductsForCreateBody,
    finishedProductsForUpdateBody,
    finishedProductsForDeleteBody: finishedProductsForDelete,
    orderMembersForCreateBody,
    orderMembersForDeleteBody: orderMembersForDelete,
  };
};
