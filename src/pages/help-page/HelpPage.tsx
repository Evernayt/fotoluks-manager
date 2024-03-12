import { Card, CardHeader, Heading } from '@chakra-ui/react';
import { YoutubePlayer } from 'components';
import styles from './HelpPage.module.scss';

const HelpPage = () => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <Heading size="md">Как создать заказ</Heading>
        </CardHeader>
        <YoutubePlayer
          videoId="V_v9ledJdUU"
          width="592px"
          height="392px"
          thumbnailQuality="sddefault"
        />
      </Card>
    </div>
  );
};

export default HelpPage;
