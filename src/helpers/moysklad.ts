import { IShop } from 'models/api/IShop';
import { IDiscount } from 'models/api/moysklad/IDiscount';
import { ISalePrice } from 'models/api/moysklad/ISalePrice';
import { IStore } from 'models/api/moysklad/IStore';

const getSellingPrice = (salePrices: ISalePrice[]) => {
  const index = salePrices.findIndex(
    (price) => price.priceType.name === 'Цена продажи'
  );
  return { salePrice: index > -1 ? salePrices[index] : null, index };
};

const getOldPrice = (salePrices: ISalePrice[]) => {
  const index = salePrices.findIndex(
    (price) => price.priceType.name === 'Старая цена'
  );
  return { salePrice: index > -1 ? salePrices[index] : null, index };
};

const getAccumulationDiscount = (discounts: IDiscount[]) => {
  return (
    discounts?.find((discount) => discount.accumulationDiscount !== undefined)
      ?.accumulationDiscount || 0
  );
};

const getStore = (store: IStore | undefined, stores: IStore[]) => {
  return stores.find((x) => x.meta.href === store?.meta.href) || null;
};

const getShopByStore = (store: IStore | undefined | null, shops: IShop[]) => {
  return shops.find((x) => store?.name.includes(x.name)) || null;
};

const getStoreByShop = (shop: IShop | undefined | null, stores: IStore[]) => {
  return stores.find((x) => x.name.includes(shop?.name || '')) || null;
};

export {
  getSellingPrice,
  getOldPrice,
  getAccumulationDiscount,
  getStore,
  getShopByStore,
  getStoreByShop,
};
