const calcDiscount = (price: number, discount: number) => {
  const discountAmount = (price / 100) * discount;
  const discountedPrice = price - discountAmount;
  return { discountAmount, discountedPrice };
};

export default calcDiscount;
