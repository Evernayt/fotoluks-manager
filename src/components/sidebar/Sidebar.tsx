import { ISidebarAddButton, ISidebarItem } from './Sidebar.types';
import { IconButton } from '@chakra-ui/react';
import { IconLayoutSidebarRight, IconLayoutSidebar } from '@tabler/icons-react';
import SidebarAddButton from './SidebarAddButton';
import SidebarItemButton from './SidebarItemButton';
import styles from './Sidebar.module.scss';

interface SidebarProps<T extends ISidebarItem> {
  isOpen: boolean;
  items?: T[];
  selectedItem?: T;
  addButton?: ISidebarAddButton;
  toggle: () => void;
  onChange?: (item: T, index: number) => void;
}

const Sidebar = <T extends ISidebarItem>({
  isOpen,
  items,
  selectedItem,
  addButton,
  toggle,
  onChange,
}: SidebarProps<T>) => {
  const selectItem = (item: T) => {
    if (!onChange) return;
    const index = items?.indexOf(item) || 0;
    onChange(item, index);
  };

  return (
    <div
      className={styles.container}
      style={{ minWidth: isOpen ? '206px' : '58px' }}
    >
      <div>
        {addButton && (
          <SidebarAddButton addButton={addButton} isSidebarOpen={isOpen} />
        )}
        {items?.map((item) => (
          <SidebarItemButton
            item={item}
            isSidebarOpen={isOpen}
            isSelected={selectedItem?.name === item.name}
            onClick={selectItem}
            key={item.id}
          />
        ))}
      </div>
      <IconButton
        className={styles.toggle_button}
        icon={
          isOpen ? (
            <IconLayoutSidebarRight className="link-icon" size={20} />
          ) : (
            <IconLayoutSidebar className="link-icon" size={20} />
          )
        }
        aria-label="toggle"
        isRound
        variant="ghost"
        colorScheme="gray"
        size="lg"
        onClick={toggle}
      />
    </div>
  );
};

export default Sidebar;
