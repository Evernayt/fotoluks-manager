import { searchIcon } from 'icons';
import { FC, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import styles from './Search.module.css';

interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  searchText: string;
  setSearchText: (v: string) => void;
  placeholder: string;
  resultMaxHeight: number;
  children: ReactNode;
}

const Search: FC<SearchProps> = ({
  searchText,
  setSearchText,
  placeholder,
  resultMaxHeight,
  children,
  ...props
}) => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  useEffect(() => {
    if (searchText.length > 0) {
      setIsShowing(true);
    } else {
      setIsShowing(false);
    }
  }, [searchText]);

  return (
    <div className={styles.container} {...props}>
      <div className={styles.input_container}>
        <img className={styles.icon} src={searchIcon} alt="search-icon" />
        <input
          className={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {isShowing && (
        <div
          className={styles.result_container}
          style={{ maxHeight: `${resultMaxHeight}px` }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Search;
