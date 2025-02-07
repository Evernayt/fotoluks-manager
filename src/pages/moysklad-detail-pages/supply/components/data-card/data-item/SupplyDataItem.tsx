import { Text } from '@chakra-ui/react';
import { FC } from 'react';
import styles from './SupplyDataItem.module.scss';

interface SupplyDataItemProps {
  title: string;
  value: string | number | undefined;
  isRequired?: boolean;
  maxWidth?: string;
}

const SupplyDataItem: FC<SupplyDataItemProps> = ({
  title,
  value,
  isRequired,
  maxWidth,
}) => {
  return (
    <div className={styles.container}>
      <Text variant="secondary">{`${title}: `}</Text>
      <Text
        className={[styles.value, isRequired && styles.required_value].join(
          ' '
        )}
        style={{ maxWidth }}
      >
        {value}
      </Text>
    </div>
  );
};

export default SupplyDataItem;
