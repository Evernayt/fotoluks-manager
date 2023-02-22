import { FC } from 'react';
import styles from './EndingGoodsProductItem.module.scss';

interface EndingGoodsProductItemProps {
  name: string;
}

const EndingGoodsProductItem: FC<EndingGoodsProductItemProps> = ({ name }) => {
  return <div className={styles.item}>{name}</div>;
};

export default EndingGoodsProductItem;
