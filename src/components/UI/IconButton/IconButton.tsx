import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './IconButton.module.css';

export enum IconButtonVariants {
  default = 'default',
  link = 'link',
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: IconButtonVariants;
  className?: string;
  children?: ReactNode;
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  variant = IconButtonVariants.default,
  className,
  children,
  ...props
}) => {
  return (
    <button className={[styles[variant], className].join(' ')} {...props}>
      {icon}
      {children}
    </button>
  );
};

export default IconButton;
