import { ButtonHTMLAttributes, CSSProperties, FC } from 'react';
import styles from './CircleButton.module.css';

interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  iconStyle?: CSSProperties;
}

const CircleButton: FC<CircleButtonProps> = ({ icon, iconStyle, ...props }) => {
  return (
    <button className={styles.container} {...props}>
      <img src={icon} alt="" style={iconStyle} />
    </button>
  );
};

export default CircleButton;
