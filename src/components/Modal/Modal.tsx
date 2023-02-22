import { IconButton } from 'components';
import { IconClose } from 'icons';
import { FC, ReactNode } from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  hide: () => void;
  children: ReactNode;
  title?: string;
  isShowing?: boolean;
  separator?: boolean;
}

const Modal: FC<ModalProps> = ({
  hide,
  children,
  title,
  isShowing,
  separator = true,
  ...props
}) => {
  return isShowing ? (
    <div className={styles.container}>
      <div className={styles.form_container} {...props}>
        <div className={styles.form_header}>
          <span className={styles.form_header_title}>{title || ''}</span>
          <IconButton
            icon={<IconClose className="link-icon" />}
            circle
            style={{
              height: '36px',
              width: '36px',
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
