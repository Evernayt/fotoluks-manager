import { calcPlacement } from 'helpers';
import { Placements } from 'helpers/calcPlacement';
import { useOnClickOutside } from 'hooks';
import { forwardRef, HTMLAttributes, useRef, useState } from 'react';
import styles from './DropdownButton.module.css';

interface OptionsProps {
  name: string;
  onClick: () => void;
}

export enum DropdownButtonVariants {
  default = 'default',
  link = 'link',
}

interface DropdownButtonProps extends HTMLAttributes<HTMLElement> {
  options: OptionsProps[];
  icon?: string;
  text?: string;
  placement: Placements;
  variant?: DropdownButtonVariants;
}

const DropdownButton = forwardRef<HTMLDivElement, DropdownButtonProps>(
  (
    {
      options,
      icon,
      text,
      placement,
      variant = DropdownButtonVariants.default,
      ...props
    },
    ref
  ) => {
    const [isHidden, setIsHidden] = useState(true);

    const dropdownBtnRef = useRef(null);

    useOnClickOutside(dropdownBtnRef, () => setIsHidden(true));

    const clickHandler = (optionFunc: () => void) => {
      optionFunc();
      setIsHidden(true);
    };

    return (
      <div className={styles.container} ref={dropdownBtnRef} {...props}>
        <div
          className={[styles.dropdown_btn, styles[variant]].join(' ')}
          onClick={() => setIsHidden((prevState) => !prevState)}
          ref={ref}
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
          {options?.map((option, index) => (
            <li key={index}>
              <div
                className={styles.item}
                onClick={() => clickHandler(option.onClick)}
              >
                {option.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default DropdownButton;
