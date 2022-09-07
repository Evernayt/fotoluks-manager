import { IFoundShops, IShop } from 'models/IShop';

export const initialShop: IShop = {
  id: 0,
  name: 'Выберите филиал',
  address: '',
  description: '',
};

export const initialFoundShops: IFoundShops = {
  shopData: { rows: [], count: 0 },
  searchText: '',
};
