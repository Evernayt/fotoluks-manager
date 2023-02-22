import { CSSProperties, FC, memo, TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerStyle?: CSSProperties;
}

const Textarea: FC<TextareaProps> = memo(
  ({ label, containerStyle, ...props }) => {
    return (
      <div className={styles.container} style={containerStyle}>
        <textarea className={styles.textarea} {...props} placeholder=" " />
        <label className={styles.label}>{label}</label>
      </div>
    );
  }
);

export default Textarea;
