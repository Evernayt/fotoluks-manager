import { FC } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useDisclosure,
} from '@chakra-ui/react';
import { IStatus } from 'models/api/IStatus';
import styles from './StatusSelect.module.scss';

interface StatusSelectProps {
  statuses: IStatus[];
  selectedStatus: IStatus;
  onChange: (status: IStatus) => void;
}

const StatusSelect: FC<StatusSelectProps> = ({
  statuses,
  selectedStatus,
  onChange,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const statusSelectHandler = (status: IStatus) => {
    onChange(status);
    onClose();
  };

  return (
    <Popover isOpen={isOpen} isLazy onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <button className={styles.trigger}>
          <div
            className={styles.indicator}
            style={{ backgroundColor: selectedStatus.color }}
          />
          {selectedStatus.name}
        </button>
      </PopoverTrigger>
      <PopoverContent w="max-content">
        <PopoverArrow />
        <PopoverBody p={2}>
          {statuses.map((status) => {
            const isSelected = status.id === selectedStatus.id;
            return (
              <div
                className={[
                  styles.item,
                  isSelected && styles.selected_item,
                ].join(' ')}
                onClick={() => !isSelected && statusSelectHandler(status)}
                key={status.id}
              >
                {status.name}
              </div>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelect;
