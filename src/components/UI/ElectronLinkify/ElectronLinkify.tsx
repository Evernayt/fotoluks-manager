import Linkify from 'linkify-react';
import styles from './ElectronLinkify.module.scss';
import { FC, ReactNode } from 'react';

interface ElectronLinkifyProps {
  children: ReactNode;
}

const ElectronLinkify: FC<ElectronLinkifyProps> = ({ children }) => {
  const renderLink = ({ attributes, content }: any) => {
    const { href } = attributes;
    return (
      <div className={styles.link} onClick={() => window.open(href)}>
        {content}
      </div>
    );
  };

  return <Linkify options={{ render: renderLink }}>{children}</Linkify>;
};

export default ElectronLinkify;
