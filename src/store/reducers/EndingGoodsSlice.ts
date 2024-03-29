import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEndingGood } from 'pages/moysklad-page/components/tables/ending-goods/EndingGoodsTable';

type EndingGoodsState = {
  endingGoods: IEndingGood[];
  orderedGoods: string[];
  notAvailableGoods: string[];
  forceUpdateProduct: boolean;
};

const initialState: EndingGoodsState = {
  endingGoods: [],
  orderedGoods: [],
  notAvailableGoods: [],
  forceUpdateProduct: false,
};

export const endingGoodsSlice = createSlice({
  name: 'endingGoods',
  initialState,
  reducers: {
    setEndingGoods(state, action: PayloadAction<IEndingGood[]>) {
      state.endingGoods = action.payload;
    },
    setOrderedGoods(state, action: PayloadAction<string[]>) {
      state.orderedGoods = action.payload;
    },
    setNotAvailableGoods(state, action: PayloadAction<string[]>) {
      state.notAvailableGoods = action.payload;
    },
    toggleOrderedByGoodId(state, action: PayloadAction<string>) {
      const endingGoods = state.endingGoods.map((endingGood) =>
        endingGood.good.id === action.payload
          ? { ...endingGood, ordered: !endingGood.ordered }
          : endingGood
      );
      state.endingGoods = endingGoods;
    },
    removeOrderedGood(state, action: PayloadAction<string>) {
      const orderedGoods = state.orderedGoods.filter(
        (orderedGood) => orderedGood !== action.payload
      );
      state.orderedGoods = orderedGoods;
    },
    addOrderedGood(state, action: PayloadAction<string>) {
      state.orderedGoods.push(action.payload);
    },
    toggleNotAvailableByGoodId(state, action: PayloadAction<string>) {
      const endingGoods = state.endingGoods.map((endingGood) =>
        endingGood.good.id === action.payload
          ? { ...endingGood, notAvailable: !endingGood.notAvailable }
          : endingGood
      );
      state.endingGoods = endingGoods;
    },
    removeNotAvailableGood(state, action: PayloadAction<string>) {
      const notAvailableGoods = state.notAvailableGoods.filter(
        (notAvailableGood) => notAvailableGood !== action.payload
      );
      state.notAvailableGoods = notAvailableGoods;
    },
    addNotAvailableGood(state, action: PayloadAction<string>) {
      state.notAvailableGoods.push(action.payload);
    },
    activeEndingGoodsRowById(state, action: PayloadAction<string>) {
      const endingGoods = state.endingGoods.map((endingGood) =>
        endingGood.id === action.payload
          ? { ...endingGood, active: true }
          : { ...endingGood, active: false }
      );
      state.endingGoods = endingGoods;
    },
    setForceUpdateProduct(state, action: PayloadAction<boolean>) {
      state.forceUpdateProduct = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const endingGoodsActions = endingGoodsSlice.actions;
export default endingGoodsSlice.reducer;
