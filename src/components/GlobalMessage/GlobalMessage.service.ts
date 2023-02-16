import { GlobalMessageVariants } from 'models/IGlobalMessage';
import store from 'store';
import { appSlice } from 'store/reducers/AppSlice';

export const showGlobalMessage = (
  message: string,
  variant = GlobalMessageVariants.danger
) => {
  store.dispatch(
    appSlice.actions.setGlobalMessage({
      message,
      variant,
      isShowing: true,
    })
  );
};
