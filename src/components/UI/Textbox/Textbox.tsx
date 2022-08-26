import { eyeIcon, eyeOffIcon } from 'icons';
import { CSSProperties, FC, InputHTMLAttributes, memo, useState } from 'react';
import styles from './Textbox.module.css';

interface TextboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isPassword?: boolean;
  containerStyle?: CSSProperties;
}

const Textbox: FC<TextboxProps> = memo(
  ({ label, isPassword, containerStyle, ...props }) => {
    const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);

    const passwordShowingToggle = () => {
      setIsPasswordShowing((prevState) => !prevState);
    };

    return (
      <div className={styles.container} style={containerStyle}>
        {isPassword && (
          <img
            className={styles.icon}
            src={isPasswordShowing ? eyeOffIcon : eyeIcon}
            onClick={passwordShowingToggle}
          />
        )}
        <input
          className={styles.textbox}
          type={isPassword && !isPasswordShowing ? 'password' : 'text'}
          style={
            isPassword ? { paddingRight: '40px' } : { paddingRight: '12px' }
          }
          {...props}
          placeholder=" "
        />
        <div className={styles.label}>{label}</div>
      </div>
    );
  }
);

export default Textbox;
