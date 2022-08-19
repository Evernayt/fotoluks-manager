import { Navmenu } from 'components';
import ProfileAvatar from './ProfileAvatar/ProfileAvatar';
import styles from './ProfilePage.module.css';
import ProfileUserEdit from './ProfileUserEdit/ProfileUserEdit';

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <Navmenu />
      <div className={styles.panel}>
        <ProfileAvatar />
        <ProfileUserEdit />
      </div>
    </div>
  );
};

export default ProfilePage;
