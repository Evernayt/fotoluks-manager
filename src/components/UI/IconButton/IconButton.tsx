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
  circle,
  ...props
}) => {
  return (
    <button
      className={[styles.base, styles[variant], className].join(' ')}
      {...props}
      style={
        circle
          ? {
              borderRadius: '50%',
              height: '40px',
              width: '40px',
              padding: 0,
              ...props.style,
            }
          : props.style
      }
    >
      {icon}
      {children}
    </button>
  );
};

export default IconButton;
