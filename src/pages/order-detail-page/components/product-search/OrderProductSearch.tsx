import ProductAPI from 'api/ProductAPI/ProductAPI';
import { Search } from 'components';
import { useDebounce } from 'hooks';
import { IProduct } from 'models/api/IProduct';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { noImage } from 'constants/images';
import { Text } from '@chakra-ui/react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { FETCH_MORE_LIMIT } from 'constants/app';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import styles from './OrderProductSearch.module.scss';

interface OrderProductSearchProps extends HTMLAttributes<HTMLDivElement> {
  placeholder: string;
  onProductClick: (product: IProduct) => void;
}

const OrderProductSearch: FC<OrderProductSearchProps> = ({
  placeholder,
  onProductClick,
  ...props
}) => {
  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(search);

  const hasNextPage = pageCount !== 0 && page !== pageCount;

  useEffect(() => {
    setProducts([]);
    if (debouncedSearchTerm) {
      setIsLoading(true);
      setPageCount(0);
      setPage(1);
      fetchProducts(1);
    }
  }, [debouncedSearchTerm]);

  const fetchProducts = (page: number) => {
    ProductAPI.getAll({ limit: FETCH_MORE_LIMIT, search: search.trim(), page })
      .then((data) => {
        setProducts((prevState) => [...prevState, ...data.rows]);
        const count = Math.ceil(data.count / FETCH_MORE_LIMIT);
        setPageCount(count);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  };

  const fetchMoreProducts = () => {
    setIsLoadingMore(true);
    setPage((prevState) => prevState + 1);
    fetchProducts(page + 1);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage,
    onLoadMore: fetchMoreProducts,
    rootMargin: '0px 0px 50px 0px',
  });

  const selectProduct = (product: IProduct) => {
    onProductClick(product);
    setSearch('');
  };

  return (
    <Search
      value={search}
      placeholder={placeholder}
      isLoading={isLoading}
      isNotFound={!products.length}
      resultMaxHeight={400}
      onChange={setSearch}
      {...props}
    >
      {products.map((product) => (
        <div
          className={styles.result}
          onClick={() => selectProduct(product)}
          key={product.id}
        >
          <img className={styles.image} src={product.image || noImage} />
          <div className={styles.product_container}>
            <Text>{product.name}</Text>
            <Text variant="secondary" fontSize="sm">
              {`${product.price} руб.`}
            </Text>
          </div>
        </div>
      ))}
      {hasNextPage && (
        <LoaderWrapper isLoading size="30px" width="100%" height="100%">
          <div className={styles.sentry} ref={sentryRef} />
        </LoaderWrapper>
      )}
    </Search>
  );
};

export default OrderProductSearch;
