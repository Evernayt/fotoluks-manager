import { ISalePrice } from 'models/api/moysklad/ISalePrice';

const getSellingPrice = (salePrices: ISalePrice[]) => {
  return salePrices.findIndex(
    (price) => price.priceType.name === 'Цена продажи'
  );
};

const getOldPrice = (salePrices: ISalePrice[]) => {
  return salePrices.findIndex(
    (price) => price.priceType.name === 'Старая цена'
  );
};

export const getNewSalePrices = (
  salePrices: ISalePrice[],
  newPrice: number
) => {
  const sellingPriceIndex = getSellingPrice(salePrices);
  const oldPriceIndex = getOldPrice(salePrices);

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
