import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStore } from 'models/api/moysklad/IStore';

type MoyskladState = {
  stores: IStore[];
  activeStore: IStore | null;
  activeSidemenuIndex: number;
  isLoading: boolean;
};

const initialState: MoyskladState = {
  stores: [],
  activeStore: null,
  activeSidemenuIndex: 0,
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
    setActiveSidemenuIndex(state, action: PayloadAction<number>) {
      state.activeSidemenuIndex = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export default moyskladSlice.reducer;
