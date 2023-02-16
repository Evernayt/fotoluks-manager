import {
  ICreatedFinishedProduct,
  ICreatedOrderMember,
  IOrderBody,
  IOrderInfoBody,
} from 'pages/OrderDetailPage/OrderDetailPage.service';

export class CreateOrderDto {
  readonly orderBody?: IOrderBody;
  readonly orderInfoBody?: IOrderInfoBody;
  readonly finishedProductsForCreateBody?: ICreatedFinishedProduct[];
  readonly finishedProductsForUpdateBody?: ICreatedFinishedProduct[];
  readonly finishedProductsForDeleteBody?: number[];
  readonly orderMembersForCreateBody?: ICreatedOrderMember[];
  readonly orderMembersForDeleteBody?: number[];
}
