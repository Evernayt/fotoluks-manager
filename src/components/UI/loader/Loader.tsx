import { Spinner } from '@chakra-ui/react';
import { CSSProperties, FC, ReactNode } from 'react';
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
  containerStyle?: CSSProperties;
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
  containerStyle,
}) => {
  return (
    <div className={styles.wrapper_container} style={containerStyle}>
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
