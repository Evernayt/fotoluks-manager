import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IFavorite } from 'models/api/IFavorite';
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IOrderProduct } from 'models/api/IOrderProduct';
import { orderActions } from 'store/reducers/OrderSlice';
import { Button, Divider, IconButton } from '@chakra-ui/react';
import { noImage } from 'constants/images';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import OrderFavoriteContextMenu, {
  ORDER_FAVORITE_MENU_ID,
} from './context-menu/OrderFavoriteContextMenu';
import { useContextMenu } from 'react-contexify';
import styles from './OrderFavorites.module.scss';

const OrderFavorites = () => {
  const favorites = useAppSelector((state) => state.order.favorites);
  const employee = useAppSelector((state) => state.employee.employee);

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { show } = useContextMenu({ id: ORDER_FAVORITE_MENU_ID });

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    if (!employee) return;
    FavoriteAPI.getAll({ employeeId: employee.id }).then((data) => {
      dispatch(orderActions.setFavorites(data.rows));
    });
  };

  const addOrderProduct = (favorite: IFavorite) => {
    const createdOrderProduct: IOrderProduct = {
      id: uuidv4(),
      price: favorite.product?.price || 0,
      quantity: 1,
      comment: '',
      folder: '',
      discount: null,
      product: favorite.product,
    };

    dispatch(orderActions.addOrderProduct(createdOrderProduct));
    dispatch(orderActions.addOrderProductsForCreate(createdOrderProduct));
  };

  const handleContextMenu = (favorite: IFavorite, event: any) => {
    show({ event, props: favorite });
  };

  const scroll = (scrollOffset: number) => {
    ref.current!.scrollLeft += scrollOffset;
  };

  return (
    <>
      {favorites.length > 0 && (
        <>
          <OrderFavoriteContextMenu />
          <div>
            <Divider orientation="vertical" mx={2} />
          </div>
          <IconButton
            icon={<IconChevronLeft size={14} />}
            aria-label="left"
            variant="ghost"
            minW="20px"
            onClick={() => scroll(-160)}
          />
          <div className={styles.container} ref={ref}>
            {favorites.map((favorite) => (
              <Button
                leftIcon={
                  <img
                    className={styles.image}
                    src={favorite.product?.image || noImage}
                  />
                }
                variant="ghost"
                pl={0}
                minW="max-content"
                onClick={() => addOrderProduct(favorite)}
                onContextMenu={(e) => handleContextMenu(favorite, e)}
                key={favorite.id}
              >
                {favorite.product?.name}
              </Button>
            ))}
          </div>
          <IconButton
            icon={<IconChevronRight size={14} />}
            aria-label="right"
            variant="ghost"
            minW="20px"
            onClick={() => scroll(160)}
          />
        </>
      )}
    </>
  );
};

export default OrderFavorites;
