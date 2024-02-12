import {
  ICreatedOrderProduct,
  ICreatedOrderMember,
  IOrderBody,
  IOrderInfoBody,
} from 'pages/order-detail-page/OrderDetailPage.service';

export class CreateOrderDto {
  readonly orderBody?: IOrderBody;
  readonly orderInfoBody?: IOrderInfoBody;
  readonly orderProductsForCreateBody?: ICreatedOrderProduct[];
  readonly orderProductsForUpdateBody?: ICreatedOrderProduct[];
  readonly orderProductsForDeleteBody?: number[];
  readonly orderMembersForCreateBody?: ICreatedOrderMember[];
  readonly orderMembersForDeleteBody?: number[];
  readonly orderFilesForDeleteBody?: number[];
}
