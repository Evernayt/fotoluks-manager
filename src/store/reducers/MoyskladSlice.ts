import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStore } from 'models/api/moysklad/IStore';

type MoyskladState = {
  stores: IStore[];
  activeStore: IStore | null;
  activeSidebarIndex: number;
  sidebarIsOpen: boolean;
  isLoading: boolean;
  search: string;
  forceUpdate: boolean;
};

const initialState: MoyskladState = {
  stores: [],
  activeStore: null,
  activeSidebarIndex: 0,
  sidebarIsOpen: true,
  isLoading: false,
  search: '',
  forceUpdate: false,
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
    setActiveSidebarIndex(state, action: PayloadAction<number>) {
      state.activeSidebarIndex = action.payload;
    },
    setSidebarIsOpen(state, action: PayloadAction<boolean>) {
      state.sidebarIsOpen = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const moyskladActions = moyskladSlice.actions;
export default moyskladSlice.reducer;
