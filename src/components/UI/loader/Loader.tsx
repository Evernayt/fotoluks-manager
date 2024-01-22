import { Spinner } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import styles from './Loader.module.scss';

export interface LoaderProps {
  size?: string;
  minHeight?: string;
}

interface LoaderWrapperProps {
  children?: ReactNode;
  isLoading?: boolean;
  size?: string;
  width?: string;
  height?: string;
}

const Loader: FC<LoaderProps> = ({ size = '50px', minHeight = '100%' }) => {
  return (
    <div className={styles.container} style={{ minHeight }}>
      <Spinner h={size} w={size} speed="0.75s" />
    </div>
  );
};

export const LoaderWrapper: FC<LoaderWrapperProps> = ({
  children,
  isLoading,
  size = '50px',
  width = 'calc(100% + 4px)',
  height = 'calc(100% + 4px)',
}) => {
  return (
    <div className={styles.wrapper_container}>
      {isLoading && (
        <div
          className={styles.loader_wrapper_container}
          style={{ width, height }}
        >
          <Spinner h={size} w={size} speed="0.75s" />
        </div>
      )}
      {children}
    </div>
  );
};

export default Loader;
