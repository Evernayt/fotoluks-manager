import { calcPlacement } from 'helpers';
import { Placements } from 'helpers/calcPlacement';
import { useOnClickOutside } from 'hooks';
import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './SelectButton.module.css';

interface IItem {
  id: number;
  name: string;
}

interface SelectButtonProps extends HTMLAttributes<HTMLDivElement> {
  items: IItem[];
  changeHandler: (item: any) => void;
  defaultSelectedItem: IItem;
  placement?: Placements;
  disabled?: boolean;
}

const SelectButton = forwardRef<HTMLDivElement, SelectButtonProps>(
  (
    {
      items,
      changeHandler,
      defaultSelectedItem,
      placement = Placements.bottomStart,
      disabled,
      ...props
    },
    ref
  ) => {
    const defaultItem = {
      id: 0,
      name: 'Выберите...',
    };

    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<IItem>(defaultItem);

    const selectBtnRef = useRef(null);

    useOnClickOutside(selectBtnRef, () => setIsHidden(true));

    useEffect(() => {
      if (defaultSelectedItem !== undefined) {
        setSelectedItem(defaultSelectedItem);
      }
    }, [defaultSelectedItem]);

    const selectItem = (item: IItem) => {
      setIsHidden(true);
      setSelectedItem(item);
      changeHandler(item);
    };

    return (
      <div className={styles.container} ref={selectBtnRef} {...props}>
        <div
          className={disabled ? styles.disabled : styles.select_btn}
          onClick={
            disabled ? () => {} : () => setIsHidden((prevState) => !prevState)
          }
          ref={ref}
        >
          {selectedItem.name}
        </div>
        <ul
          className={styles.menu}
          style={{
            display: isHidden ? 'none' : 'block',
            ...calcPlacement(placement),
          }}
        >
          {items.map((item) => {
            const id = uuidv4();
            return (
              <li key={item.id}>
                <input
                  className={styles.input}
                  id={id}
                  name="select_btn"
                  type="radio"
                  checked={selectedItem.id === item.id}
                  onChange={() => selectItem(item)}
                />
                <label className={styles.item} htmlFor={id}>
                  {item.name}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);

export default SelectButton;
