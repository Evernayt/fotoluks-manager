import { IconEdit } from 'icons';
import { ChangeEvent, FC, useRef } from 'react';
import styles from './Avatar.module.scss';

const DEF_SIZE = 160;

interface AvatarProps {
  image: string;
  onAvatarSelect: (image: File) => void;
  size?: number;
}

const Avatar: FC<AvatarProps> = ({ image, onAvatarSelect, size }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const avatarSelectHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      onAvatarSelect(image);
    }
  };

  return (
    <>
      <div
        className={styles.avatar_container}
        style={
          size
            ? { height: `${size}px`, width: `${size}px` }
            : { height: `${DEF_SIZE}px`, width: `${DEF_SIZE}px` }
        }
        onClick={handleImageClick}
      >
        <IconEdit
          className={[styles.avatar_edit_icon, 'secondary-dark-icon'].join(' ')}
        />
        <div
          className={styles.avatar_fogging}
          style={
            size
              ? { height: `${size + 1}px`, width: `${size + 1}px` }
              : { height: `${DEF_SIZE + 1}px`, width: `${DEF_SIZE + 1}px` }
          }
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={avatarSelectHandler}
        accept="image/png, image/jpeg"
      />
      <img
        className={styles.avatar}
        style={
          size
            ? { height: `${size}px`, width: `${size}px` }
            : { height: `${DEF_SIZE}px`, width: `${DEF_SIZE}px` }
        }
        src={image}
        alt=""
      />
    </>
  );
};

export default Avatar;
