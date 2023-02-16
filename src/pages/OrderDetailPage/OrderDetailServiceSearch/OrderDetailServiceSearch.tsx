import ProductAPI from 'api/ProductAPI/ProductAPI';
import { Search } from 'components';
import { noImage } from 'constants/images';
import { useDebounce } from 'hooks';
import { IProduct } from 'models/api/IProduct';
import { IType } from 'models/api/IType';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import styles from './OrderDetailServiceSearch.module.scss';

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface PropsExtra {
  onClick: (product: IProduct, type: IType) => void;
}

interface OrderDetailServiceSearchProps
  extends SimpleSpread<HTMLAttributes<HTMLDivElement>, PropsExtra> {
  onClick: (product: IProduct, type: IType) => void;
}

const OrderDetailServiceSearch: FC<OrderDetailServiceSearchProps> = ({
  onClick,
  ...props
}) => {
  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<IProduct[]>([]);

  const debouncedSearchTerm = useDebounce(search);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [debouncedSearchTerm]);

  const fetchProducts = () => {
    if (search.trim()) {
      ProductAPI.getAll({ search }).then((data) => {
        setProducts(data.rows);
      });
    }
  };

  const selectService = (product: IProduct, type: IType) => {
    onClick(product, type);
    setSearch('');
  };

  return (
    <Search
      value={search}
      placeholder="Поиск услуг"
      onChange={setSearch}
      {...props}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id}>
            {product.types?.map((type) => (
              <div
                className={styles.result}
                key={type.id}
                onClick={() => selectService(product, type)}
              >
                <img
                  className={styles.type_image}
                  src={type.image === '' ? noImage : type.image}
                  alt=""
                />
                <div className={styles.type_container}>
                  <span className={styles.product_name}>{product.name}</span>
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
