import { FC } from 'react';
import { Divider, IconButton, Tooltip } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons-react';
import { ISidebarAddButton } from './Sidebar.types';
import styles from './Sidebar.module.scss';

interface SidebarAddButtonProps {
  addButton: ISidebarAddButton;
  isSidebarOpen: boolean;
}

const SidebarAddButton: FC<SidebarAddButtonProps> = ({
  addButton,
  isSidebarOpen,
}) => {
  return (
    <>
      <Tooltip
        label={addButton.name}
        placement="right"
        isDisabled={isSidebarOpen}
      >
        <div className={styles.item_container}>
          <IconButton
            icon={<IconPlus />}
            aria-label="plus"
            colorScheme="yellow"
            size="lg"
            w="100%"
            justifyContent="flex-start"
            pl="9px"
            onClick={addButton.onClick}
          />
          <span
            className={[
              styles.item_text,
              styles.add_button_text,
              isSidebarOpen && styles.item_text_visible,
            ].join(' ')}
          >
            {addButton.name}
          </span>
        </div>
      </Tooltip>
      <Divider my="9px" />
    </>
  );
};

export default SidebarAddButton;
