import { ButtonHTMLAttributes, FC, memo, ReactNode } from 'react';
import styles from './CircleButton.module.css';

interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  className?: string;
}

const CircleButton: FC<CircleButtonProps> = memo(
  ({ icon, className, ...props }) => {
    return (
      <button className={[styles.container, className].join(' ')} {...props}>
        {icon}
      </button>
    );
  }
);

export default CircleButton;
