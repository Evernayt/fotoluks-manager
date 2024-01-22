import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPosition } from 'models/api/moysklad/IPosition';

type MoveState = {
  positions: IPosition[];
};

const initialState: MoveState = {
  positions: [],
};

export const moveSlice = createSlice({
  name: 'move',
  initialState,
  reducers: {
    setPositions(state, action: PayloadAction<IPosition[]>) {
      state.positions = action.payload;
    },
    editPosition(
      state,
      action: PayloadAction<{ rowIndex: number; position: IPosition }>
    ) {
      state.positions[action.payload.rowIndex] = action.payload.position;
    },
    deletePosition(state, action: PayloadAction<number>) {
      state.positions.splice(action.payload, 1);
    },
    addPosition(state, action: PayloadAction<IPosition>) {
      state.positions.push(action.payload);
    },
    clearState() {
      return initialState;
    },
  },
});

export const moveActions = moveSlice.actions;
export default moveSlice.reducer;
