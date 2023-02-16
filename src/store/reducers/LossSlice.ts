import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoss } from 'models/api/moysklad/ILoss';
import { IPosition } from 'models/api/moysklad/IPosition';

type LossState = {
  losses: ILoss[];
  positions: IPosition[];
  activeItemName: string;
};

const initialState: LossState = {
  losses: [],
  positions: [],
  activeItemName: '',
};

export const lossSlice = createSlice({
  name: 'loss',
  initialState,
  reducers: {
    setLosses(state, action: PayloadAction<ILoss[]>) {
      state.losses = action.payload;
    },
    setPositions(state, action: PayloadAction<IPosition[]>) {
      state.positions = action.payload;
    },
    setActiveItemName(state, action: PayloadAction<string>) {
      state.activeItemName = action.payload;
    },
    setPosition(
      state,
      action: PayloadAction<{ index: number; position: IPosition }>
    ) {
      state.positions[action.payload.index] = action.payload.position;
    },
    deletePosition(state, action: PayloadAction<number>) {
      state.positions.splice(action.payload, 1);
    },
  },
});

export default lossSlice.reducer;
