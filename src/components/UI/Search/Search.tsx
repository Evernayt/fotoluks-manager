import { IconSearch } from 'icons';
import { FC, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import styles from './Search.module.scss';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface PropsExtra {
  onChange: (value: any) => void;
}

interface SearchProps
  extends SimpleSpread<HTMLAttributes<HTMLDivElement>, PropsExtra> {
  value: string;
  onChange: (value: any) => void;
  children?: ReactNode;
  placeholder?: string;
  resultMaxHeight?: number;
  showResults?: boolean;
  className?: string;
  disabled?: boolean;
}

const Search: FC<SearchProps> = ({
  value,
  onChange,
  children,
  placeholder = 'Поиск',
  resultMaxHeight = 300,
  showResults = true,
  className,
  disabled = false,
  ...props
}) => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  useEffect(() => {
    if (value.length > 0) {
      setIsShowing(true);
    } else {
      setIsShowing(false);
    }
  }, [value]);

  return (
    <div className={[styles.container, className].join(' ')} {...props}>
      <div className={styles.input_container}>
        <IconSearch
          className={[styles.icon, 'link-icon'].join(' ')}
          size={18}
        />
        <input
          className={styles.input}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {showResults && isShowing && (
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
