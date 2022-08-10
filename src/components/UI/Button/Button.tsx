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
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = ButtonVariants.default, className, children, ...props },
    ref
  ) => {
    return (
      <button
        className={[styles[variant], className].join(' ')}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;
