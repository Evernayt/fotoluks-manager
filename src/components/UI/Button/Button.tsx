import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import styles from './Button.module.scss';

export enum ButtonVariants {
  default = 'default',
  primary = 'primary',
  primaryDeemphasized = 'primary_deemphasized',
  link = 'link',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariants;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = ButtonVariants.default,
      className,
      isLoading,
      loadingText = 'Загрузка...',
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={[styles.base, styles[variant], className].join(' ')}
        {...props}
        disabled={isLoading || props.disabled}
        ref={ref}
      >
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

export default Button;
