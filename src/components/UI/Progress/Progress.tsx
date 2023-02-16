import { FC } from 'react';
import styles from './Progress.module.scss';

interface ProgressProps {
  percent: number;
}

const Progress: FC<ProgressProps> = ({ percent }) => {
  return (
    <div className={styles.container}>
      <div style={{ width: percent >= 100 ? '100%' : `${percent}%` }}></div>
    </div>
  );
};

export default Progress;
