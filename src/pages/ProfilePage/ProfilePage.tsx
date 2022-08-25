import { Navmenu } from 'components';
import ProfileAvatar from './ProfileAvatar/ProfileAvatar';
import ProfileStatistics from './ProfileStatistics/ProfileStatistics';
import ProfileUserEdit from './ProfileUserEdit/ProfileUserEdit';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <Navmenu />
      <div className={styles.panels}>
        <div className={styles.panel} style={{ minWidth: '400px' }}>
          <ProfileAvatar />
          <ProfileUserEdit />
        </div>
        <div className={styles.panel} style={{ width: '100%' }}>
          <ProfileStatistics />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
