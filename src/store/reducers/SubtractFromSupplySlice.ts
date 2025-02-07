import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPosition } from 'models/api/moysklad/IPosition';
import { ISupply } from 'models/api/moysklad/ISupply';
import {
  INITIAL_SUPPLY_DATA,
  ISupplyData,
} from 'pages/moysklad-detail-pages/supply/components/data-card/SupplyDataCard';

type SubtractFromSupplyState = {
  supply: Partial<ISupply> | null;
  supplyData: ISupplyData;
  positions: IPosition[];
  lastActiveRowId: string;
};

const initialState: SubtractFromSupplyState = {
  supply: null,
  supplyData: INITIAL_SUPPLY_DATA,
  positions: [],
  lastActiveRowId: '',
};

export const subtractFromSupplySlice = createSlice({
  name: 'subtractFromSupply',
  initialState,
  reducers: {
    setSupply(state, action: PayloadAction<Partial<ISupply>>) {
      state.supply = action.payload;
    },
    setSupplyData(state, action: PayloadAction<ISupplyData>) {
      state.supplyData = action.payload;
    },
    setPositions(state, action: PayloadAction<IPosition[]>) {
      state.positions = action.payload;
    },
    addPosition(state, action: PayloadAction<IPosition>) {
      state.positions.push(action.payload);
    },
    editPosition(state, action: PayloadAction<IPosition>) {
      const positions = state.positions.map((position) =>
        position.id === action.payload.id ? action.payload : position
      );
      state.positions = positions;
    },
    deletePosition(state, action: PayloadAction<string>) {
      const positions = state.positions.filter(
        (position) => position.id !== action.payload
      );
      state.positions = positions;
    },
    setLastActiveRowId(state, action: PayloadAction<string>) {
      state.lastActiveRowId = action.payload;
    },
    clearSupply(state) {
      state.supply = initialState.supply;
      state.supplyData = initialState.supplyData;
      state.positions = initialState.positions;
    },
    clearState() {
      return initialState;
    },
  },
});

export const subtractFromSupplyActions = subtractFromSupplySlice.actions;
export default subtractFromSupplySlice.reducer;
