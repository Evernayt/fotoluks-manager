import { ButtonHTMLAttributes, CSSProperties, FC, memo } from 'react';
import styles from './CircleButton.module.css';

interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  iconStyle?: CSSProperties;
  className?: string;
}

const CircleButton: FC<CircleButtonProps> = memo(
  ({ icon, iconStyle, className, ...props }) => {
    return (
      <button className={[styles.container, className].join(' ')} {...props}>
        <img src={icon} alt="" style={iconStyle} />
      </button>
    );
  }
);

export default CircleButton;
