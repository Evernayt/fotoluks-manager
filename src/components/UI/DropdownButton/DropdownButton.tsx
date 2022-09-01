import { calcPlacement } from 'helpers';
import { Placements } from 'helpers/calcPlacement';
import { useOnClickOutside } from 'hooks';
import { forwardRef, HTMLAttributes, ReactNode, useRef, useState } from 'react';
import styles from './DropdownButton.module.css';

export interface IDropdownButtonOption {
  id: number;
  name: string;
  onClick: (option: IDropdownButtonOption) => void;
}

export enum DropdownButtonVariants {
  default = 'default',
  link = 'link',
  primaryDeemphasized = 'primary_deemphasized',
}

interface DropdownButtonProps extends HTMLAttributes<HTMLElement> {
  options?: IDropdownButtonOption[];
  icon?: string;
  text?: string;
  placement: Placements;
  variant?: DropdownButtonVariants;
  circle?: boolean;
  menuToggleCb?: () => void;
  itemRender?: () => ReactNode;
}

const DropdownButton = forwardRef<HTMLDivElement, DropdownButtonProps>(
  (
    {
      options,
      icon,
      text,
      placement,
      variant = DropdownButtonVariants.default,
      circle,
      menuToggleCb,
      itemRender,
      ...props
    },
    ref
  ) => {
    const [isHidden, setIsHidden] = useState(true);

    const dropdownBtnRef = useRef(null);

    useOnClickOutside(dropdownBtnRef, () => setIsHidden(true));

    const clickHandler = (option: IDropdownButtonOption) => {
      option.onClick(option);
      setIsHidden(true);
    };

    const toggle = () => {
      setIsHidden((prevState) => !prevState);
      if (menuToggleCb) menuToggleCb();
    };

    return (
      <div className={styles.container} ref={dropdownBtnRef} {...props}>
        <div
          className={[styles.dropdown_btn, styles[variant]].join(' ')}
          onClick={toggle}
          ref={ref}
          style={
            circle ? { borderRadius: '50%', height: '40px', width: '16px' } : {}
          }
        >
          {icon ? <img src={icon} alt="" /> : <span>{text}</span>}
        </div>
        <ul
          className={styles.menu}
          style={{
            display: isHidden ? 'none' : 'block',
            ...calcPlacement(placement),
          }}
        >
          {itemRender === undefined
            ? options?.map((option) => (
                <li key={option.id}>
                  <div
                    className={styles.item}
                    onClick={() => clickHandler(option)}
                  >
                    {option.name}
                  </div>
                </li>
              ))
            : itemRender()}
        </ul>
      </div>
    );
  }
);

export default DropdownButton;
