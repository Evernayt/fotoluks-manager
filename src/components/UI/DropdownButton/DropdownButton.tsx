import { calcPlacement } from 'helpers';
import { Placements } from 'helpers/calcPlacement';
import { useOnClickOutside } from 'hooks';
import { forwardRef, HTMLAttributes, ReactNode, useRef, useState } from 'react';
import styles from './DropdownButton.module.scss';

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
  icon?: ReactNode;
  text?: string;
  placement?: Placements;
  variant?: DropdownButtonVariants;
  circle?: boolean;
  menuToggleCb?: () => void;
  itemRender?: () => ReactNode;
  containerClassName?: string;
}

const DropdownButton = forwardRef<HTMLDivElement, DropdownButtonProps>(
  (
    {
      options,
      icon,
      text,
      placement = Placements.bottomStart,
      variant = DropdownButtonVariants.default,
      circle,
      menuToggleCb,
      itemRender,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [isHidden, setIsHidden] = useState<boolean>(true);

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
      <div
        className={[styles.container, containerClassName].join(' ')}
        ref={dropdownBtnRef}
        {...props}
      >
        <div
          className={[styles.dropdown_btn, styles[variant]].join(' ')}
          onClick={toggle}
          ref={ref}
          style={
            circle
              ? {
                  borderRadius: '50%',
                  height: '40px',
                  width: '40px',
                  padding: 0,
                }
              : {}
          }
        >
          {icon ? icon : <span>{text}</span>}
        </div>
        <ul
          className={styles.menu}
          style={{
            display: isHidden ? 'none' : 'block',
            ...calcPlacement(placement),
          }}
        >
          {!itemRender
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
