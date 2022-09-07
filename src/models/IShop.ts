export interface IShop {
  id: number;
  name: string;
  address: string;
  description: string;
  archive?: boolean;
}

export interface IShopData {
  rows: IShop[];
  count: number;
}
