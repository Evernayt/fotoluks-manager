import { getOldPrice, getSellingPrice } from 'helpers/moysklad';
import { ISalePrice } from 'models/api/moysklad/ISalePrice';

export const getNewSalePrices = (
  salePrices: ISalePrice[],
  newPrice: number
) => {
  const sellingPriceIndex = getSellingPrice(salePrices).index;
  const oldPriceIndex = getOldPrice(salePrices).index;

  const value = newPrice / 0.01;
  let mark = '↑';

  if (salePrices[sellingPriceIndex].value <= value) {
    salePrices[sellingPriceIndex] = { ...salePrices[sellingPriceIndex], value };
    salePrices[oldPriceIndex] = { ...salePrices[oldPriceIndex], value: 0 };
    mark = '↑';
  } else {
    const oldPrice = salePrices[sellingPriceIndex].value;
    salePrices[sellingPriceIndex] = { ...salePrices[sellingPriceIndex], value };
    salePrices[oldPriceIndex] = {
      ...salePrices[oldPriceIndex],
      value: oldPrice,
    };
    mark = '↓↓↓';
  }

  return { salePrices, mark };
};

export const getPriceMark = (salePrices: ISalePrice[], newPrice: number) => {
  const sellingPriceIndex = getSellingPrice(salePrices).index;
  const oldPriceIndex = getOldPrice(salePrices).index;

  const value = newPrice / 0.01;

  if (salePrices[sellingPriceIndex].value <= value) {
    salePrices[sellingPriceIndex] = { ...salePrices[sellingPriceIndex], value };
    salePrices[oldPriceIndex] = { ...salePrices[oldPriceIndex], value: 0 };
  } else {
    const oldPrice = salePrices[sellingPriceIndex].value;
    salePrices[sellingPriceIndex] = { ...salePrices[sellingPriceIndex], value };
    salePrices[oldPriceIndex] = {
      ...salePrices[oldPriceIndex],
      value: oldPrice,
    };
  }

  return salePrices;
};
