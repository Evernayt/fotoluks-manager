import IconButton, {
  IconButtonVariants,
} from 'components/UI/IconButton/IconButton';
import { logoBird } from 'constants/images';
import { IconClose } from 'icons';
import { FC, ReactNode } from 'react';
import styles from './DetailNavmenu.module.scss';

interface DetailNavmenuProps {
  title: string;
  onClose: () => void;
  rightSection?: ReactNode;
}

const DetailNavmenu: FC<DetailNavmenuProps> = ({
  title,
  onClose,
  rightSection,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <IconButton
          className={styles.close_btn}
          icon={<IconClose className="secondary-dark-icon" />}
          variant={IconButtonVariants.dark}
          circle
          onClick={onClose}
        />
        <img className={styles.logo} src={logoBird} alt="logo" />
      </div>
      <div className={styles.center_section}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.right_section}>{rightSection}</div>
    </div>
  );
};

export default DetailNavmenu;
