import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEditor } from 'models/IEditor';
import { IPosition } from 'models/api/moysklad/IPosition';

type MoveState = {
  positions: IPosition[];
  moveEditors: IEditor[];
  lastActiveRowId: string;
};

const initialState: MoveState = {
  positions: [],
  moveEditors: [],
  lastActiveRowId: '',
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
    setMoveEditors(state, action: PayloadAction<IEditor[]>) {
      state.moveEditors = action.payload;
    },
    deleteMoveEditorByEmployeeId(state, action: PayloadAction<number>) {
      state.moveEditors = state.moveEditors.filter(
        (x) => x.employee.id !== action.payload
      );
    },
    setLastActiveRowId(state, action: PayloadAction<string>) {
      state.lastActiveRowId = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const moveActions = moveSlice.actions;
export default moveSlice.reducer;
