import { NOT_INDICATED } from 'constants/app';
import { FC, HTMLAttributes, useState } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import styles from './CopiedItem.module.scss';

interface CopiedItemProps extends HTMLAttributes<HTMLDivElement> {
  text: string | number;
  isDanger?: boolean;
}

const CopiedItem: FC<CopiedItemProps> = ({ text, isDanger, ...props }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyHandler = () => {
    if (text === NOT_INDICATED) return;
    navigator.clipboard.writeText(text.toString()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    });
  };

  return (
    <Tooltip label="Скопировано" disabled={!isCopied} delay={0}>
      <div
        {...props}
        className={[styles.item, isDanger && styles.danger].join(' ')}
        style={{ cursor: text === NOT_INDICATED ? 'default' : 'pointer' }}
        onClick={copyHandler}
      >
        {text}
      </div>
    </Tooltip>
  );
};

export default CopiedItem;
