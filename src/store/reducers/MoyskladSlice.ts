import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStore } from 'models/api/moysklad/IStore';

type MoyskladState = {
  stores: IStore[];
  activeStore: IStore | null;
  activeTableId: number;
  isLoading: boolean;
};

const initialState: MoyskladState = {
  stores: [],
  activeStore: null,
  activeTableId: 1,
  isLoading: false,
};

export const moyskladSlice = createSlice({
  name: 'moysklad',
  initialState,
  reducers: {
    setStores(state, action: PayloadAction<IStore[]>) {
      state.stores = action.payload;
    },
    setActiveStore(state, action: PayloadAction<IStore>) {
      state.activeStore = action.payload;
    },
    setActiveTableId(state, action: PayloadAction<number>) {
      state.activeTableId = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearState(state) {
      state = initialState;
    },
  },
});

export default moyskladSlice.reducer;
