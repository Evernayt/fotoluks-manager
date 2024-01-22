import { useState, useEffect } from 'react';
import RecentLogin from './recent-login/RecentLogin';
import { IEmployee } from 'models/api/IEmployee';
import { getRecentLogins, setRecentLogins } from 'helpers/localStorage';
import { Heading, Image, Text, useColorMode } from '@chakra-ui/react';
import { logoDark, logoLight } from 'constants/images';
import styles from './RecentLogins.module.scss';

const RecentLogins = () => {
  const [recentEmployees, setRecentEmployees] = useState<IEmployee[]>([]);

  const { colorMode } = useColorMode();

  useEffect(() => {
    setRecentEmployees(getRecentLogins());
  }, []);

  const removeRecentLogin = (employeeId: number) => {
    const recentLogins = recentEmployees.filter(
      (state) => state.id !== employeeId
    );
    setRecentEmployees(recentLogins);
    setRecentLogins(recentLogins);
  };

  return (
    <div>
      <Image src={colorMode === 'light' ? logoLight : logoDark} w="48" pb={4} />
      {recentEmployees.length > 0 ? (
        <>
          <Heading size="lg">Недавние входы</Heading>
          <Text variant="secondary">Нажмите на изображение чтобы войти.</Text>
          <div className={styles.recent_logins}>
            {recentEmployees.map((recentEmployee) => (
              <RecentLogin
                employee={recentEmployee}
                removeRecentLogin={removeRecentLogin}
                key={recentEmployee.id}
              />
            ))}
          </div>
        </>
      ) : (
        <Heading size="lg">Добро пожаловать!</Heading>
      )}
    </div>
  );
};

export default RecentLogins;
