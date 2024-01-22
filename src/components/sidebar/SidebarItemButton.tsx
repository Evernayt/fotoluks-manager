import { IconButton, Tooltip } from '@chakra-ui/react';
import { ISidebarItem } from './Sidebar.types';
import styles from './Sidebar.module.scss';

interface SidebarItemButtonProps<T extends ISidebarItem> {
  item: T;
  isSidebarOpen: boolean;
  isSelected: boolean;
  onClick: (item: T) => void;
}

const SidebarItemButton = <T extends ISidebarItem>({
  item,
  isSidebarOpen,
  isSelected,
  onClick,
}: SidebarItemButtonProps<T>) => {
  const { Icon } = item;

  const itemClickHandler = () => {
    onClick(item);
  };

  return (
    <Tooltip label={item.name} placement="right" isDisabled={isSidebarOpen}>
      <div className={styles.item_container}>
        <IconButton
          icon={
            Icon && (
              <Icon
                className={isSelected ? 'link-checked-icon' : 'link-icon'}
              />
            )
          }
          aria-label="icon"
          isDisabled={isSelected}
          variant="ghost"
          size="lg"
          w="100%"
          justifyContent="flex-start"
          pl="9px"
          _disabled={{ cursor: 'default' }}
          onClick={itemClickHandler}
        />
        <span
          className={[
            styles.item_text,
            isSidebarOpen && styles.item_text_visible,
          ].join(' ')}
        >
          {item.name}
        </span>
      </div>
    </Tooltip>
  );
};

export default SidebarItemButton;
