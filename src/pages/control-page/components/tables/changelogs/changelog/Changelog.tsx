import { IChangelog } from 'models/api/IChangelog';
import { FC } from 'react';
import { Heading, Tag, Text } from '@chakra-ui/react';
import moment from 'moment';
import styles from './Changelog.module.scss';

interface ChangelogProps {
  changelog: IChangelog;
  onClick: (changelog: IChangelog) => void;
}

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'Добавлено':
      return 'green';
    case 'Изменено':
      return 'blue';
    case 'Исправлено':
      return 'purple';
    case 'Удалено':
      return 'red';
    default:
      return 'gray';
  }
};

const Changelog: FC<ChangelogProps> = ({ changelog, onClick }) => {
  const splitDescription = () => {
    const result: string[][] = [];
    let acc: string[] = [];

    for (const line of changelog.description.split('\n')) {
      if (line[0] === '&') {
        result.push(acc);
        acc = [line.substring(1), ''];
      } else {
        acc[1] += (acc[1] && '\n') + line;
      }
    }

    result.push(acc);
    result.shift();

    return result;
  };

  return (
    <div className={styles.container} onClick={() => onClick(changelog)}>
      <div className={styles.header}>
        <Heading size="md">{changelog.version}</Heading>
        <Text className={styles.date} variant="secondary">
          {moment(changelog.createdAt).locale('ru').format('DD MMMM, YYYY')}
        </Text>
      </div>
      <div className={styles.description}>
        {splitDescription().map((text, index) => (
          <div key={index}>
            <Tag className={styles.tag} colorScheme={getTagColor(text[0])}>
              {text[0]}
            </Tag>
            <Text>{text[1]}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Changelog;
