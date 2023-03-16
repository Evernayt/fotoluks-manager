import { defaultAvatar } from 'constants/images';
import { FC } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import styles from './AvatarList.module.scss';
import { IAvatarListItem } from './AvatarList.types';

interface AvatarListProps {
  items: IAvatarListItem[];
}

const AvatarList: FC<AvatarListProps> = ({ items }) => {
  return (
    <div className={styles.container}>
      {items.map((item) => (
        <Tooltip label={item.name} delay={100} key={item.id}>
          <div className={styles.item}>
            <img className={styles.image} src={item.avatar || defaultAvatar} />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default AvatarList;
