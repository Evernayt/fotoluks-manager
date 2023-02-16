import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDepartment } from 'models/api/IDepartment';
import { IPosition } from 'models/api/moysklad/IPosition';

type MoveState = {
  positions: IPosition[];
  department: IDepartment | undefined;
};

const initialState: MoveState = {
  positions: [],
  department: undefined,
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
      action: PayloadAction<{ index: number; position: IPosition }>
    ) {
      state.positions[action.payload.index] = action.payload.position;
    },
    deletePosition(state, action: PayloadAction<number>) {
      state.positions.splice(action.payload, 1);
    },
    addPosition(state, action: PayloadAction<IPosition>) {
      state.positions.push(action.payload);
    },
    setDepartment(state, action: PayloadAction<IDepartment>) {
      state.department = action.payload;
    },
  },
});

export default moveSlice.reducer;
