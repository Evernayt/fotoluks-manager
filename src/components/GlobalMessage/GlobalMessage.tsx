import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { closeIcon } from 'icons';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { useEffect } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import styles from './GlobalMessage.module.css';

const GlobalMessage = () => {
  const { message, variant, isShowing } = useAppSelector(
    (state) => state.app.globalMessage
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isShowing) {
      setTimeout(close, 5000);
    }
  }, [isShowing]);

  const close = () => {
    dispatch(
      appSlice.actions.showGlobalMessage({
        message: '',
        variant: GlobalMessageVariants.success,
        isShowing: false,
      })
    );
  };

  return isShowing ? (
    <div className={[styles.container, styles[variant]].join(' ')}>
      <div className={styles.text}>{message}</div>
      <div className={styles.close_button} onClick={close}>
        <img className={styles.close_icon} src={closeIcon} />
      </div>
    </div>
  ) : null;
};

export default GlobalMessage;
