import { CircleButton } from 'components';
import { close2Icon } from 'icons';
import { FC, ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  isShowing: boolean;
  hide: () => void;
  separator?: boolean;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({
  title,
  isShowing,
  hide,
  separator = true,
  children,
  ...props
}) => {
  return isShowing ? (
    <div className={styles.container}>
      <div className={styles.form_container} {...props}>
        <div className={styles.form_header}>
          <span className={styles.form_header_title}>{title}</span>
          <CircleButton
            icon={close2Icon}
            style={{
              height: '36px',
              width: '36px',
              paddingLeft: '1px',
              marginLeft: '12px',
            }}
            onClick={hide}
          />
        </div>
        {separator && <div className="separator" style={{ margin: 0 }} />}
        <div className={styles.form}>{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
