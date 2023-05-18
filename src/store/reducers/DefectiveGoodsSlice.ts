import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IDefectiveGood } from 'models/IDefectiveGood';

type DefectiveGoodsState = {
  defectiveGoods: IDefectiveGood[];
  foundProduct: IAssortment | null;
  lastDefectiveGood: IDefectiveGood | null;
};

const initialState: DefectiveGoodsState = {
  defectiveGoods: [],
  foundProduct: null,
  lastDefectiveGood: null,
};

export const defectiveGoodsSlice = createSlice({
  name: 'defectiveGoods',
  initialState,
  reducers: {
    setFoundProduct(state, action: PayloadAction<IAssortment | null>) {
      state.foundProduct = action.payload;
    },
    setDefectiveGoods(state, action: PayloadAction<IDefectiveGood[]>) {
      state.defectiveGoods = action.payload;
    },
    addDefectiveGood(state, action: PayloadAction<IDefectiveGood>) {
      state.defectiveGoods.push(action.payload);
    },
    setQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const defectiveGoods = state.defectiveGoods.map((x) =>
        x.id === action.payload.id
          ? { ...x, quantity: action.payload.quantity }
          : x
      );
      state.defectiveGoods = defectiveGoods;
    },
    remove(state, action: PayloadAction<string>) {
      const defectiveGoods = state.defectiveGoods.filter(
        (x) => x.id !== action.payload
      );
      state.defectiveGoods = defectiveGoods;
    },
    removeAll(state) {
      state.defectiveGoods = [];
    },
    setLastDefectiveGood(state, action: PayloadAction<IDefectiveGood | null>) {
      state.lastDefectiveGood = action.payload;
    },
  },
});

export default defectiveGoodsSlice.reducer;
