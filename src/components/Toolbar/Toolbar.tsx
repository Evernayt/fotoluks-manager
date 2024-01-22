import { FC, ReactNode } from 'react';
import styles from './Toolbar.module.scss';
import { Divider } from '@chakra-ui/react';

interface ToolbarProps {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

const Toolbar: FC<ToolbarProps> = ({ leftSection, rightSection }) => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.left_section}>{leftSection}</div>
        <div className={styles.right_section}>{rightSection}</div>
      </div>
      <Divider />
    </div>
  );
};

export default Toolbar;
