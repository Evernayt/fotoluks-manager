import { ClearIndicatorProps } from 'chakra-react-select';
import { IconX } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import styles from './ClearIndicator.module.scss';

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <div {...props.innerProps} className={styles.button}>
      <IconX size={ICON_SIZE} stroke={ICON_STROKE} />
    </div>
  );
};

export default ClearIndicator;
