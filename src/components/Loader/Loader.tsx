import { FC } from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
  height?: string;
  width?: string;
}

const Loader: FC<LoaderProps> = ({ height, width }) => {
  return (
    <div className={styles.container} style={{ height, width }}>
      <div className={styles.loader}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
