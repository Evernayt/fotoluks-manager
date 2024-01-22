import { Card } from '@chakra-ui/react';
import ProfileEmployeeEdit from './components/employee-edit/ProfileEmployeeEdit';
import ProfileStatistics from './components/statistics/ProfileStatistics';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.panel}>
        <ProfileEmployeeEdit />
      </Card>
      <Card className={styles.panel} style={{ flex: 1 }}>
        <ProfileStatistics />
      </Card>
    </div>
  );
};

export default ProfilePage;
