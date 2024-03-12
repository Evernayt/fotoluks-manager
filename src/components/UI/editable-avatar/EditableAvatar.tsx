import { ChangeEvent, FC, useRef } from 'react';
import { IconPencil, IconX } from '@tabler/icons-react';
import { Avatar, IconButton } from '@chakra-ui/react';
import styles from './EditableAvatar.module.scss';

interface EditableAvatarProps {
  avatar?: string | null;
  size?: string;
  onAvatarSelect?: (image: File) => void;
  onAvatarRemove?: () => void;
}

const EditableAvatar: FC<EditableAvatarProps> = ({
  avatar,
  size = '160px',
  onAvatarSelect,
  onAvatarRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const avatarSelectHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onAvatarSelect) return;
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      onAvatarSelect(image);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container} style={{ height: size, width: size }}>
      {onAvatarRemove && (
        <IconButton
          className={styles.close_button}
          icon={<IconX size={14} />}
          aria-label="remove"
          isRound
          position="absolute"
          zIndex={3}
          size="xs"
          colorScheme="red"
          onClick={onAvatarRemove}
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
        onChange={avatarSelectHandler}
        accept="image/png, image/jpeg"
      />
      <Avatar src={avatar || undefined} h={size} w={size} bg="gray.400" />
    </div>
  );
};

export default EditableAvatar;
