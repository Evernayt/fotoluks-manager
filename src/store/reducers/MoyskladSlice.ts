import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStore } from 'models/api/moysklad/IStore';

type MoyskladState = {
  stores: IStore[];
  activeStore: IStore | null;
  activeSidebarIndex: number;
  sidebarIsOpen: boolean;
  isLoading: boolean;
  forceUpdate: boolean;
  assortmentsSearch: string;
  defectiveGoodsSearch: string;
  movesSearch: string;
  stocksSearch: string;
  updatePricesSearch: string;
};

const initialState: MoyskladState = {
  stores: [],
  activeStore: null,
  activeSidebarIndex: 0,
  sidebarIsOpen: true,
  isLoading: false,
  forceUpdate: false,
  assortmentsSearch: '',
  defectiveGoodsSearch: '',
  movesSearch: '',
  stocksSearch: '',
  updatePricesSearch: '',
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
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setAssortmentsSearch(state, action: PayloadAction<string>) {
      state.assortmentsSearch = action.payload;
    },
    setDefectiveGoodsSearch(state, action: PayloadAction<string>) {
      state.defectiveGoodsSearch = action.payload;
    },
    setMovesSearch(state, action: PayloadAction<string>) {
      state.movesSearch = action.payload;
    },
    setStocksSearch(state, action: PayloadAction<string>) {
      state.stocksSearch = action.payload;
    },
    setUpdatePricesSearch(state, action: PayloadAction<string>) {
      state.updatePricesSearch = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const moyskladActions = moyskladSlice.actions;
export default moyskladSlice.reducer;
