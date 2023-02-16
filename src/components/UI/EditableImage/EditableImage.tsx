import { IconEdit } from 'icons';
import { ChangeEvent, FC, useRef } from 'react';
import styles from './EditableImage.module.scss';

const DEF_SIZE = 160;

interface EditableImageProps {
  image: string;
  onImageSelect: (image: File) => void;
  size?: number;
  className?: string;
}

const EditableImage: FC<EditableImageProps> = ({
  image,
  onImageSelect,
  size,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const imageSelectHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      onImageSelect(image);
    }
  };

  return (
    <div className={className}>
      <div
        className={styles.image_container}
        style={
          size
            ? { height: `${size}px`, width: `${size}px` }
            : { height: `${DEF_SIZE}px`, width: `${DEF_SIZE}px` }
        }
        onClick={handleImageClick}
      >
        <IconEdit
          className={[styles.image_edit_icon, 'secondary-dark-icon'].join(' ')}
        />
        <div
          className={styles.image_fogging}
          style={
            size
              ? { height: `${size}px`, width: `${size}px` }
              : { height: `${DEF_SIZE}px`, width: `${DEF_SIZE}px` }
          }
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={imageSelectHandler}
        accept="image/png, image/jpeg"
      />
      <img
        className={styles.image}
        style={
          size
            ? { height: `${size}px`, width: `${size}px` }
            : { height: `${DEF_SIZE}px`, width: `${DEF_SIZE}px` }
        }
        src={image}
        alt=""
      />
    </div>
  );
};

export default EditableImage;
