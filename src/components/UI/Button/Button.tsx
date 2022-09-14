import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';

export enum ButtonVariants {
  default = 'default',
  primary = 'primary',
  primaryDeemphasized = 'primary_deemphasized',
  link = 'link',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = ButtonVariants.default,
      className,
      isLoading,
      loadingText = 'Загрузка...',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={[styles[variant], className].join(' ')}
        {...props}
        ref={ref}
      >
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

export default Button;
