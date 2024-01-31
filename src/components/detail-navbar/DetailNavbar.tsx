import { FC, ReactNode } from 'react';
import { logoSmall } from 'constants/images';
import { Heading, IconButton } from '@chakra-ui/react';
import { IconX } from '@tabler/icons-react';
import styles from './DetailNavbar.module.scss';

interface DetailNavmenuProps {
  title: string;
  centerSection?: ReactNode;
  rightSection?: ReactNode;
  onClose: () => void;
}

const DetailNavbar: FC<DetailNavmenuProps> = ({
  title,
  centerSection,
  rightSection,
  onClose,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <IconButton
          icon={<IconX className="secondary-dark-icon" />}
          aria-label="close"
          isRound
          onClick={onClose}
        />
        <img className={styles.logo} src={logoSmall} alt="logo" />
      </div>
      <div className={styles.center_section}>
        <Heading className={styles.title} size="md">
          {title}
        </Heading>
        {centerSection}
      </div>
      <div className={styles.right_section}>{rightSection}</div>
    </div>
  );
};

export default DetailNavbar;
