import { Search } from 'components';
import { useDebounce } from 'hooks';
import { searchProductsAPI } from 'http/productAPI';
import { IProduct } from 'models/IProduct';
import { IType } from 'models/IType';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import styles from './OrderDetailServiceSearch.module.css';

interface OrderDetailServiceSearchProps extends HTMLAttributes<HTMLDivElement> {
  searchSelect: (product: IProduct, type: IType) => void;
}

const OrderDetailServiceSearch: FC<OrderDetailServiceSearchProps> = ({
  searchSelect,
  ...props
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [foundServices, setFoundServices] = useState<IProduct[]>([]);

  const debouncedSearchTerm = useDebounce(searchText, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchService();
    } else {
      setFoundServices([]);
    }
  }, [debouncedSearchTerm]);

  const searchService = () => {
    if (searchText.trim() !== '') {
      searchProductsAPI(15, 1, searchText).then((data) => {
        setFoundServices(data);
        console.log(data)
      });
    }
  };

  const selectService = (product: IProduct, type: IType) => {
    searchSelect(product, type);
    setSearchText('');
  };

  return (
    <Search
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Поиск услуг"
      resultMaxHeight={300}
      {...props}
    >
      {foundServices.length > 0 ? (
        foundServices.map((foundService) => (
          <div key={foundService.id}>
            {foundService.types?.map((type) => (
              <div
                className={styles.result}
                key={type.id}
                onClick={() => selectService(foundService, type)}
              >
                <img className={styles.type_image} src={type.image} alt="" />
                <div className={styles.type_container}>
                  <span className={styles.product_name}>
                    {foundService.name}
                  </span>
                  <span className={styles.type_name}>{type.name}</span>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className={styles.not_found}>Ничего не найдено</div>
      )}
    </Search>
  );
};

export default OrderDetailServiceSearch;
