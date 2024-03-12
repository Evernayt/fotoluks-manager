import { ChangeEvent, FC, useRef } from 'react';
import { IconPencil, IconX } from '@tabler/icons-react';
import { IconButton, Image } from '@chakra-ui/react';
import { noImage } from 'constants/images';
import styles from './EditableImage.module.scss';

interface EditableImageProps {
  image?: string | null;
  size?: string;
  onImageSelect?: (image: File) => void;
  onImageRemove?: () => void;
}

const EditableImage: FC<EditableImageProps> = ({
  image,
  size = '160px',
  onImageSelect,
  onImageRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const imageSelectHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onImageSelect) return;
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      onImageSelect(image);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container} style={{ height: size, width: size }}>
      {onImageRemove && (
        <IconButton
          className={styles.close_button}
          icon={<IconX size={14} />}
          aria-label="remove"
          isRound
          position="absolute"
          zIndex={3}
          size="xs"
          colorScheme="red"
          onClick={onImageRemove}
        />
      )}
      <div className={styles.image_container} onClick={handleImageClick}>
        <IconPencil className={styles.image_edit_icon} />
        <div className={styles.image_fogging} />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={imageSelectHandler}
        accept="image/png, image/jpeg"
      />
      <Image
        className={styles.image}
        src={image || noImage}
        h={size}
        w={size}
      />
    </div>
  );
};

export default EditableImage;
