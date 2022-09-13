import { IconSearch } from 'icons';
import { FC, InputHTMLAttributes } from 'react';
import styles from './NavmenuSearch.module.css';

interface NavmenuSearchProps extends InputHTMLAttributes<HTMLInputElement> {}

const NavmenuSearch: FC<NavmenuSearchProps> = ({ ...props }) => {
  return (
    <div className={styles.input_container}>
      <IconSearch className={[styles.icon, 'link-icon'].join(' ')} size={18} />
      <input className={styles.input} {...props} />
    </div>
  );
};

export default NavmenuSearch;
