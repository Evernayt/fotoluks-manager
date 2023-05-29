import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NOTIF_LIMIT } from 'constants/app';
import { IEmployee } from 'models/api/IEmployee';
import { INotification } from 'models/api/INotification';

type EmployeeState = {
  employee: IEmployee | null;
  isAuth: boolean;
  notifications: INotification[];
};

const initialState: EmployeeState = {
  employee: null,
  isAuth: false,
  notifications: [],
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<IEmployee>) {
      state.isAuth = true;
      state.employee = action.payload;
    },
    addNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications.push(...action.payload);
    },
    addNotification(state, action: PayloadAction<INotification>) {
      state.notifications.unshift(action.payload);
      if (state.notifications.length > NOTIF_LIMIT) {
        state.notifications.pop();
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    updateEmployee(state, action: PayloadAction<IEmployee>) {
      state.employee = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export default employeeSlice.reducer;
