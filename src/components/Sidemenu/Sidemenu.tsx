import { useEffect, useState } from 'react';
import { ISidemenuItem, ISidemenuAddButton } from './Sidemenu.types';
import styles from './Sidemenu.module.scss';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { IconPlus, IconSidemenu, IconSidemenuChecked } from 'icons';

interface SidemenuProps<T extends ISidemenuItem> {
  isOpen: boolean;
  items?: T[];
  defaultActiveItem?: T;
  addButton?: ISidemenuAddButton;
  toggle: () => void;
  onChange?: (item: T, index: number) => void;
}

const Sidemenu = <T extends ISidemenuItem>({
  isOpen,
  items,
  defaultActiveItem,
  addButton,
  toggle,
  onChange,
}: SidemenuProps<T>) => {
  const [activeItem, setActiveItem] = useState<T | undefined>(
    defaultActiveItem
  );

  useEffect(() => {
    if (defaultActiveItem) {
      setActiveItem(defaultActiveItem);
    }
  }, [defaultActiveItem]);

  useEffect(() => {
    if (activeItem) {
      selectItem(activeItem);
    }
  }, [activeItem]);

  const selectItem = (item: T) => {
    setActiveItem(item);
    if (!onChange) return;
    const index = items?.indexOf(item) || 0;
    onChange(item, index);
  };

  return (
    <div
      className={styles.container}
      style={{ minWidth: isOpen ? '206px' : '52px' }}
    >
      <div>
        {addButton && (
          <>
            <Tooltip
              label={addButton.text}
              placement="right"
              delay={500}
              disabled={isOpen}
            >
              <div className={styles.btn} onClick={addButton.onClick}>
                <div className={styles.btn_icon}>
                  <IconPlus className="primary-checked-icon" size={20} />
                </div>
                <span
                  className={styles.text}
                  style={
                    isOpen
                      ? { opacity: '1', visibility: 'visible' }
                      : { opacity: '0', visibility: 'hidden' }
                  }
                >
                  {addButton.text}
                </span>
              </div>
            </Tooltip>
            <div className="separator" />
          </>
        )}

        {items?.map((item) => {
          const { Icon } = item;
          return (
            <Tooltip
              label={item.name}
              placement="right"
              delay={400}
              disabled={isOpen}
              key={item.id}
            >
              <div>
                <input
                  id={item.name}
                  name="sidemenu"
                  type="radio"
                  checked={activeItem?.name === item.name}
                  onChange={() => setActiveItem(item)}
                />
                <label className={styles.rbtn} htmlFor={item.name}>
                  <div className={styles.rbtn_icon}>
                    {Icon && (
                      <Icon
                        className={
                          activeItem?.name === item.name
                            ? 'secondary-checked-icon'
                            : 'secondary-icon'
                        }
                        size={20}
                      />
                    )}
                  </div>
                  <div
                    className={styles.text}
                    style={
                      isOpen
                        ? { opacity: '1', visibility: 'visible' }
                        : { opacity: '0', visibility: 'hidden' }
                    }
                  >
                    {item.name}
                  </div>
                </label>
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div>
        <input
          id="sidemenu_toggle"
          name="sidemenu_toggle"
          type="checkbox"
          onChange={toggle}
        />
        <label className={styles.toggle} htmlFor="sidemenu_toggle">
          {isOpen ? (
            <IconSidemenuChecked className="link-icon" size={20} />
          ) : (
            <IconSidemenu className="link-icon" size={20} />
          )}
        </label>
      </div>
    </div>
  );
};

export default Sidemenu;
