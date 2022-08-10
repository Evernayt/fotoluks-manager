import { INPUT_FORMAT } from 'constants/app';
import { IFoundOrders, IOrder } from 'models/IOrder';
import moment from 'moment';

const initialDeadline = moment().add(3, 'days').format(INPUT_FORMAT);

export const initialOrder: IOrder = {
  id: 0,
  user: null,
  status: null,
  shop: null,
  finishedProducts: [],
  deadline: initialDeadline,
  createdAt: '',
  prepayment: 0,
  sum: 0,
  comment: '',
};

export const initialFoundOrders: IFoundOrders = {
  orderData: { rows: [], count: 0 },
  searchText: '',
};
