import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { uploadAvatarAPI } from 'http/uploadFileAPI';
import { updateUserAPI } from 'http/userAPI';
import { IconEdit } from 'icons';
import { IUser } from 'models/IUser';
import { ChangeEvent, useRef } from 'react';
import { userSlice } from 'store/reducers/UserSlice';
import styles from './ProfileAvatar.module.css';

const ProfileAvatar = () => {
  const user = useAppSelector((state) => state.user.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const editAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];

      const formData = new FormData();
      formData.append('avatar', image);

      uploadAvatarAPI(formData)
        .then((res) => res.text())
        .then((data) => {
          if (!user) return;

          const updatedUser: IUser = { ...user, avatar: data };
          updateUserAPI(updatedUser).then((data) => {
            dispatch(userSlice.actions.updateUser(data));
          });
        })
        .catch((e) => {
          console.log(e.response.data.message);
        });
    }
  };

  return (
    <div>
      <div className={styles.avatar_container} onClick={handleImageClick}>
        <IconEdit
          className={[styles.avatar_edit_icon, 'secondary-dark-icon'].join(' ')}
        />
        <div className={styles.avatar_fogging} />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={editAvatar}
        accept="image/png, image/jpeg"
      />
      <img
        className={styles.avatar}
        src={user?.avatar ? user.avatar : defaultAvatar}
      />
    </div>
  );
};

export default ProfileAvatar;
