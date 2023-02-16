import { calcPlacement } from 'helpers';
import { Placements } from 'helpers/calcPlacement';
import { useOnClickOutside } from 'hooks';
import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ISelectItem } from './SelectButton.types';
import styles from './SelectButton.module.scss';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface PropsExtra {
  onChange: (item: any, index: number) => void;
}

interface SelectButtonProps
  extends SimpleSpread<HTMLAttributes<HTMLDivElement>, PropsExtra> {
  items: ISelectItem[];
  onChange: (item: any, index: number) => void;
  defaultSelectedItem?: ISelectItem;
  placement?: Placements;
  disabled?: boolean;
  containerClassName?: string;
}

const SelectButton = forwardRef<HTMLDivElement, SelectButtonProps>(
  (
    {
      items,
      onChange,
      defaultSelectedItem,
      placement = Placements.bottomStart,
      disabled,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const defaultItem = {
      id: -1,
      name: 'Выберите...',
    };

    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<ISelectItem>(defaultItem);

    const selectBtnRef = useRef(null);

    useOnClickOutside(selectBtnRef, () => setIsHidden(true));

    useEffect(() => {
      if (defaultSelectedItem) {
        setSelectedItem(defaultSelectedItem);
      }
    }, [defaultSelectedItem]);

    useEffect(() => {
      const jsonSelectedItem = JSON.stringify(selectedItem);
      const jsonDefaultItem = JSON.stringify(defaultItem);

      if (jsonSelectedItem !== jsonDefaultItem) {
        const index = items.indexOf(selectedItem);
        selectItem(selectedItem, index);
      }
    }, [selectedItem]);

    const selectItem = (item: ISelectItem, index: number) => {
      setIsHidden(true);
      setSelectedItem(item);
      onChange(item, index);
    };

    return (
      <div
        className={[styles.container, containerClassName].join(' ')}
        ref={selectBtnRef}
        {...props}
      >
        <div
          className={disabled ? styles.disabled : styles.select_btn}
          onClick={
            disabled ? () => {} : () => setIsHidden((prevState) => !prevState)
          }
          ref={ref}
        >
          {selectedItem?.name}
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
                  checked={selectedItem?.id === item.id}
                  onChange={() => setSelectedItem(item)}
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
