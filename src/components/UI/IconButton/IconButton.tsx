import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './IconButton.module.scss';

export enum IconButtonVariants {
  default = 'default',
  primary = 'primary',
  link = 'link',
  dark = 'dark',
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: IconButtonVariants;
  className?: string;
  children?: ReactNode;
  circle?: boolean;
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  variant = IconButtonVariants.default,
  className,
  children,
  circle = false,
  ...props
}) => {
  return (
    <button
      className={[
        styles.base,
        styles[variant],
        circle && styles.circle,
        className,
      ].join(' ')}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default IconButton;
