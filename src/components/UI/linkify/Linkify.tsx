import ReactLinkify from 'linkify-react';
import { FC, ReactNode } from 'react';
import styles from './Linkify.module.scss';

interface ElectronLinkifyProps {
  children: ReactNode;
  className?: string;
}

const Linkify: FC<ElectronLinkifyProps> = ({ children, className }) => {
  const renderLink = ({ attributes, content }: any) => {
    const { href } = attributes;
    return (
      <div className={styles.link} onClick={() => window.open(href)}>
        {content}
      </div>
    );
  };

  return (
    <div className={className}>
      <ReactLinkify options={{ render: renderLink }}>{children}</ReactLinkify>
    </div>
  );
};

export default Linkify;
