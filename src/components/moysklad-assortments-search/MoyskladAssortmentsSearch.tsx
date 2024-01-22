import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Search } from 'components';
import { useDebounce } from 'hooks';
import { useAppSelector } from 'hooks/redux';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { FC, useEffect, useState, HTMLAttributes } from 'react';
import { Tag, Text } from '@chakra-ui/react';
import { IStore } from 'models/api/moysklad/IStore';
import styles from './MoyskladAssortmentsSearch.module.scss';

interface MoyskladAssortmentsSearchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  isDisabled?: boolean;
  store?: IStore | null;
  onChange: (assortment: IAssortment) => void;
}

const MoyskladAssortmentsSearch: FC<MoyskladAssortmentsSearchProps> = ({
  isDisabled,
  store,
  onChange,
  ...props
}) => {
  const [search, setSearch] = useState<string>('');
  const [foundAssortments, setFoundAssortments] = useState<IAssortment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeStore = useAppSelector((state) => state.moysklad.activeStore);

  const debouncedSearchTerm = useDebounce(search);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchAssortments();
    } else {
      clear();
    }
  }, [debouncedSearchTerm]);

  const searchAssortments = () => {
    if (search.trim()) {
      setIsLoading(true);

      MoyskladAPI.getAssortment({
        limit: 50,
        search,
        stockStore: store ? store.meta.href : activeStore?.meta.href,
      })
        .then((data) => {
          setFoundAssortments(data?.rows || []);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const clear = () => {
    setIsLoading(true);
    setFoundAssortments([]);
  };

  const changeHandler = (assortment: IAssortment) => {
    onChange(assortment);
    setSearch('');
    clear();
  };

  return (
    <Search
      {...props}
      value={search}
      onChange={setSearch}
      placeholder="Добавить позицию — введите наименование, код, штрихкод или артикул"
      isRound={false}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isNotFound={!foundAssortments.length}
    >
      {foundAssortments.map((assortment) => (
        <div
          className={styles.result}
          onClick={() => changeHandler(assortment)}
          key={assortment.id}
        >
          <Text>
            <Text as="b">{assortment.code}</Text> {assortment.name}
          </Text>
          <Tag
            colorScheme={
              assortment.stock && assortment.stock > 0 ? 'green' : 'red'
            }
          >
            {assortment.stock ? assortment.stock : 0}
          </Tag>
        </div>
      ))}
    </Search>
  );
};

export default MoyskladAssortmentsSearch;
