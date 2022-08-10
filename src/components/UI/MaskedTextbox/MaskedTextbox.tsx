import { mask as masker, unMask } from 'node-masker';
import { CSSProperties, FC, InputHTMLAttributes } from 'react';
import styles from './MaskedTextbox.module.css';

interface MaskedTextboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  mask: string;
  containerStyle?: CSSProperties;
}

const MaskedTextbox: FC<MaskedTextboxProps> = ({
  label,
  value,
  setValue,
  mask,
  containerStyle,
  ...props
}) => {
  return (
    <div className={styles.container} style={containerStyle}>
      <input
        className={styles.textbox}
        {...props}
        placeholder=" "
        onChange={({ target }) =>
          target.value.length <= mask.length && setValue(unMask(target.value))
        }
        value={masker(value, mask)}
      />
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export default MaskedTextbox;
