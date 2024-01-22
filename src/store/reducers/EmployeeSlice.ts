import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FETCH_MORE_LIMIT } from 'constants/app';
import { IEmployee } from 'models/api/IEmployee';
import { INotification } from 'models/api/INotification';

type EmployeeState = {
  employee: IEmployee | null;
  notifications: INotification[];
};

const initialState: EmployeeState = {
  employee: null,
  notifications: [],
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<IEmployee>) {
      state.employee = action.payload;
    },
    updateEmployee(state, action: PayloadAction<IEmployee>) {
      state.employee = action.payload;
    },
    addNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications.push(...action.payload);
    },
    addNotification(state, action: PayloadAction<INotification>) {
      state.notifications.unshift(action.payload);
      if (state.notifications.length > FETCH_MORE_LIMIT) {
        state.notifications.pop();
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    clearState() {
      return initialState;
    },
  },
});

export const employeeActions = employeeSlice.actions;
export default employeeSlice.reducer;
