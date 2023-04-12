import { FC, InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  text: string;
  containerClassName: string;
}

const Checkbox: FC<CheckboxProps> = ({
  text,
  containerClassName,
  ...props
}) => {
  return (
    <div className={[styles.container, containerClassName].join(' ')}>
      <input
        className={styles.checkbox}
        type="checkbox"
        id={`${text}_checkbox`}
        {...props}
      />
      <label className={styles.label} htmlFor={`${text}_checkbox`}>
        {text}
      </label>
    </div>
  );
};

export default Checkbox;
