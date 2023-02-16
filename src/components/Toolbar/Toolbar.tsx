import { FC, ReactNode } from 'react';
import styles from './Toolbar.module.scss';

interface ToolbarProps {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

const Toolbar: FC<ToolbarProps> = ({ leftSection, rightSection }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left_section}>{leftSection}</div>
      <div className={styles.right_section}>{rightSection}</div>
    </div>
  );
};

export default Toolbar;
