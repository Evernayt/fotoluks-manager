import { IconMinus, IconPlus } from 'icons';
import { FC } from 'react';
import styles from './PlusMinusButton.module.scss';
import IconButton from '../IconButton/IconButton';

interface PlusMinusButtonProps {
  text: string;
  image?: string;
  isPlus?: boolean;
  onClick?: () => void;
  onPlusMinusClick?: () => void;
}

const PlusMinusButton: FC<PlusMinusButtonProps> = ({
  text,
  image,
  isPlus = false,
  onClick,
  onPlusMinusClick,
}) => {
  return (
    <div className={styles.container}>
      {image && <img className={styles.img} src={image} />}
      <div
        className={styles.text}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        {text}
      </div>
      <IconButton
        className={styles.button}
        style={{padding: 4, height: 32}}
        icon={
          isPlus ? (
            <IconPlus className="secondary-icon" />
          ) : (
            <IconMinus className="secondary-icon" />
          )
        }
        onClick={onPlusMinusClick}
      />
    </div>
  );
};

export default PlusMinusButton;
