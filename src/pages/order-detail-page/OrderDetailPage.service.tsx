import { calcDiscount } from 'helpers';
import { IOrder } from 'models/api/IOrder';
import { IOrderMember } from 'models/api/IOrderMember';
import { IOrderProduct } from 'models/api/IOrderProduct';

export interface ICreatedOrderProduct {
  id: number | string;
  orderId: number | null;
  quantity: number;
  price: number;
  comment: string;
  folder: string;
  discount: number | null;
  productId?: number;
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
  prepayment: number;
  discount: number;
  deadline: string | null;
  comment: string;
}

export interface IOrderInfoBody {
  employeeId: number;
  statusId: number;
}

interface ICreateOrderBodyForSave {
  (
    orderProductsForCreate: IOrderProduct[],
    orderProductsForUpdate: IOrderProduct[],
    orderProductsForDelete: number[],
    order: IOrder,
    sum: number,
    creatorUserId: number,
    activeShopId: number,
    orderMembersForCreate: IOrderMember[],
    orderMembersForDelete: number[],
    orderFilesForDelete: number[]
  ): {
    orderBody: IOrderBody;
    orderInfoBody: IOrderInfoBody;
    orderProductsForCreateBody: ICreatedOrderProduct[];
    orderProductsForUpdateBody: ICreatedOrderProduct[];
    orderProductsForDeleteBody: number[];
    orderMembersForCreateBody: ICreatedOrderMember[];
    orderMembersForDeleteBody: number[];
    orderFilesForDeleteBody: number[];
  };
}

const createOrderProductBody = (
  orderProduct: IOrderProduct,
  orderId: number
): ICreatedOrderProduct => {
  return {
    ...orderProduct,
    productId: orderProduct.product?.id,
    orderId,
  };
};

export const createOrderBodyForSave: ICreateOrderBodyForSave = (
  orderProductsForCreate,
  orderProductsForUpdate,
  orderProductsForDelete,
  order,
  sum,
  creatorEmployeeId,
  activeShopId,
  orderMembersForCreate,
  orderMembersForDelete,
  orderFilesForDelete
) => {
  const orderBody: IOrderBody = {
    id: order.id,
    userId: order.user?.id || null,
    statusId: order.status?.id || 1,
    shopId: order.shop?.id || activeShopId,
    sum,
    prepayment: order.prepayment || 0,
    discount: order.discount || 0,
    deadline: order.deadline || null,
    comment: order.comment || '',
  };

  const orderInfoBody: IOrderInfoBody = {
    employeeId: creatorEmployeeId,
    statusId: 1,
  };

  const orderProductsForCreateBody: ICreatedOrderProduct[] = [];
  orderProductsForCreate.forEach((orderProductForCreate) => {
    const createdOrderProduct = createOrderProductBody(
      orderProductForCreate,
      order.id
    );
    orderProductsForCreateBody.push(createdOrderProduct);
  });

  const orderProductsForUpdateBody: ICreatedOrderProduct[] = [];
  orderProductsForUpdate.forEach((orderProductForUpdate) => {
    const createdOrderProduct = createOrderProductBody(
      orderProductForUpdate,
      order.id
    );
    orderProductsForUpdateBody.push(createdOrderProduct);
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
    orderProductsForCreateBody,
    orderProductsForUpdateBody,
    orderProductsForDeleteBody: orderProductsForDelete,
    orderMembersForCreateBody,
    orderMembersForDeleteBody: orderMembersForDelete,
    orderFilesForDeleteBody: orderFilesForDelete,
  };
};

export const calcSumWithDiscount = (
  discount: number,
  quantity: number,
  price: number
) => {
  const sum = calcDiscount(
    Number(quantity) * Number(price),
    Number(discount)
  ).discountedPrice;

  return sum;
};
