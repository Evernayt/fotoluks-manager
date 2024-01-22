import AuthForm from './components/auth-form/AuthForm';
import RecentLogins from './components/recent-logins/RecentLogins';
import LoginModal from './modals/login-modal/LoginModal';
import { Updater } from 'components';
import { useState } from 'react';
import { Image, Progress } from '@chakra-ui/react';
import { logoSmall } from 'constants/images';
import { getToken } from 'helpers/localStorage';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const token = getToken();
  const [isAutoSignIn, setIsAutoSignIn] = useState<boolean>(token !== '');

  return (
    <>
      {isAutoSignIn && (
        <div className={styles.loader}>
          <Image src={logoSmall} w="100px" />
          <Progress
            isIndeterminate
            colorScheme="yellow"
            size="sm"
            w="60%"
            borderRadius="full"
          />
        </div>
      )}
      <LoginModal />
      <div className={styles.header}>
        <Updater />
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <RecentLogins />
        </div>
        <div className={styles.section}>
          <AuthForm setIsAutoSignIn={setIsAutoSignIn} />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
