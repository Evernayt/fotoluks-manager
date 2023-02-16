import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Search, Loader } from 'components';
import { useDebounce } from 'hooks';
import { useAppSelector } from 'hooks/redux';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { FC, useEffect, useState } from 'react';
import styles from './MoyskladAssortmentsSearch.module.scss';

interface MoyskladAssortmentsSearchProps {
  onChange: (assortment: IAssortment) => void;
}

const MoyskladAssortmentsSearch: FC<MoyskladAssortmentsSearchProps> = ({
  onChange,
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
        stockStore: activeStore?.meta.href,
      })
        .then((data) => {
          setFoundAssortments(data.rows);
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
      value={search}
      onChange={setSearch}
      placeholder="Добавить позицию — введите наименование, код, штрихкод или артикул"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {foundAssortments.length > 0 ? (
            foundAssortments.map((assortment) => (
              <div
                className={styles.result}
                onClick={() => changeHandler(assortment)}
                key={assortment.id}
              >
                <span>
                  <b>{assortment.code}</b> {assortment.name}
                </span>
                <div
                  className={
                    assortment.stock && assortment.stock > 0
                      ? styles.assortment_stock
                      : [styles.assortment_stock, styles.danger].join(' ')
                  }
                >
                  {assortment.stock ? assortment.stock : 0}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.not_found}>Ничего не найдено</div>
          )}
        </>
      )}
    </Search>
  );
};

export default MoyskladAssortmentsSearch;
