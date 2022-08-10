import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from 'models/IUser';

type UserState = {
  user: IUser | null;
  isAuth: boolean;
};

const initialState: UserState = {
  user: null,
  isAuth: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin(state, action: PayloadAction<IUser>) {
      state.isAuth = true;
      state.user = action.payload;
    },
    signout(state) {
      state.isAuth = false;
      state.user = null;
    },
  },
});

export const { signin, signout } = userSlice.actions;

export default userSlice.reducer;
