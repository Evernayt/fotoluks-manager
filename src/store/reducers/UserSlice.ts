import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from 'models/INotification';
import { IUser } from 'models/IUser';

type UserState = {
  user: IUser | null;
  isAuth: boolean;
  notifications: INotification[];
};

const initialState: UserState = {
  user: null,
  isAuth: false,
  notifications: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<IUser>) {
      state.isAuth = true;
      state.user = action.payload;
    },
    signOut(state) {
      state.isAuth = false;
      state.user = null;
    },
    addNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications.push(...action.payload);
    },
    addNotification(state, action: PayloadAction<INotification>) {
      state.notifications.unshift(action.payload);
      state.notifications.pop();
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  signIn,
  signOut,
  addNotifications,
  addNotification,
  clearNotifications,
} = userSlice.actions;

export default userSlice.reducer;
