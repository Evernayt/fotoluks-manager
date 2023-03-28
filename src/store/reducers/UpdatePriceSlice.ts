import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPosition } from 'models/api/moysklad/IPosition';

type UpdatePriceState = {
  positions: IPosition[];
};

const initialState: UpdatePriceState = {
  positions: [],
};

export const updatePriceSlice = createSlice({
  name: 'updatePrice',
  initialState,
  reducers: {
    setPositions(state, action: PayloadAction<IPosition[]>) {
      state.positions = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export default updatePriceSlice.reducer;
