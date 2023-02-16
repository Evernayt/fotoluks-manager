import { INPUT_DATE_FORMAT } from 'constants/app';
import { IOrder } from 'models/api/IOrder';
import moment from 'moment';

const INITIAL_DEADLINE = moment().add(3, 'days').format(INPUT_DATE_FORMAT);

export const INITIAL_ORDER: IOrder = {
  id: 0,
  finishedProducts: [],
  deadline: INITIAL_DEADLINE,
  createdAt: '',
  prepayment: 0,
  sum: 0,
  comment: '',
  orderMembers: [],
};
