import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './IconButton.module.css';

export enum IconButtonVariants {
  default = 'default',
  link = 'link',
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariants;
  icon: string;
  children?: ReactNode;
}

const IconButton: FC<IconButtonProps> = ({
  variant = IconButtonVariants.default,
  icon,
  children,
  ...props
}) => {
  return (
    <button className={styles[variant]} {...props}>
      <img
        className={styles.icon}
        style={
          children === undefined ? { marginRight: 0 } : { marginRight: '8px' }
        }
        src={icon}
        alt=""
      />
      {children}
    </button>
  );
};

export default IconButton;
