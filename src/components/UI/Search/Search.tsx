import { FC, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import {
  Card,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { ICON_STROKE } from 'constants/app';
import Loader from '../loader/Loader';
import styles from './Search.module.scss';

export interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (value: any) => void;
  children?: ReactNode;
  placeholder?: string;
  resultMaxHeight?: number;
  showResults?: boolean;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isNotFound?: boolean;
  isRound?: boolean;
  footer?: ReactNode;
}

const Search: FC<SearchProps> = ({
  value,
  onChange,
  children,
  placeholder = 'Поиск',
  resultMaxHeight = 300,
  showResults = true,
  className,
  isDisabled,
  isLoading,
  isNotFound,
  isRound = true,
  footer,
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
      <InputGroup>
        <InputLeftElement ml="1" pointerEvents="none">
          <IconSearch className="link-icon" size={18} stroke={ICON_STROKE} />
        </InputLeftElement>
        <Input
          className={styles.search_input}
          value={value}
          placeholder={placeholder}
          isDisabled={isDisabled}
          variant="filled"
          borderRadius={isRound ? '999' : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputRightElement hidden={!value}>
          <IconButton
            icon={<IconX size={18} stroke={ICON_STROKE} />}
            aria-label="close"
            variant="link"
            size="sm"
            onClick={() => onChange('')}
          />
        </InputRightElement>
      </InputGroup>
      {showResults && isShowing && (
        <Card
          className={styles.result_container}
          maxH={`${resultMaxHeight}px`}
          position="absolute"
        >
          <div className={styles.results}>
            {isLoading ? (
              <Loader size="30px" minHeight="52px" />
            ) : (
              <>
                {isNotFound ? (
                  <Text className={styles.not_found}>Ничего не найдено</Text>
                ) : (
                  children
                )}
              </>
            )}
          </div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </Card>
      )}
    </div>
  );
};

export default Search;
