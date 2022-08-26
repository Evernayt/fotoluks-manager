import { IconButton } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { deleteFavoriteAPI, fetchFavoritesAPI } from 'http/favoriteAPI';
import { minusIcon, plusIcon } from 'icons';
import { IFavorite } from 'models/IFavorite';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { ISelectedParam } from 'models/ISelectedParam';
import { useEffect } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import styles from './OrderDetailFavorites.module.css';

const OrderDetailFavorites = () => {
  const user = useAppSelector((state) => state.user.user);
  const favorites = useAppSelector((state) => state.order.favorites);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    if (!user) return;

    fetchFavoritesAPI(user.id).then((data) => {
      dispatch(orderSlice.actions.setFavorites(data));
    });
  };

  const openOrderDetailAddFavoriteModal = () => {
    dispatch(modalSlice.actions.openOrderDetailAddFavoriteModal());
  };

  const deleteFavorite = (favoriteId: number) => {
    deleteFavoriteAPI(favoriteId).then(() => {
      dispatch(orderSlice.actions.deleteFavoriteById(favoriteId));
    });
  };

  const addFinishedProduct = (favorite: IFavorite) => {
    const selectedParams: ISelectedParam[] = [];
    for (let i = 0; i < favorite.favoriteParams.length; i++) {
      selectedParams.push({
        id: uuidv4(),
        param: favorite.favoriteParams[i].param,
      });
    }

    const createdFinishedProduct: IFinishedProduct = {
      id: uuidv4(),
      quantity: 1,
      price: favorite.type.price,
      comment: '',
      product: favorite.type.product!,
      type: favorite.type,
      selectedParams,
    };

    dispatch(orderSlice.actions.addFinishedProduct(createdFinishedProduct));
    dispatch(
      orderSlice.actions.addFinishedProductsForCreate(createdFinishedProduct)
    );
  };

  return (
    <div className={styles.container}>
      <IconButton icon={plusIcon} onClick={openOrderDetailAddFavoriteModal} />
      {favorites.map((favorite) => (
        <div className={styles.favorite_container} key={favorite.id}>
          <div
            className={styles.favorite_button}
            onClick={() => addFinishedProduct(favorite)}
          >
            {`${
              favorite.type.product?.name
            } ${favorite.type.name.toLowerCase()} ${favorite.favoriteParams.map(
              (favoriteParam) => ' ' + favoriteParam.param.name.toLowerCase()
            )}`}
          </div>

          <IconButton
            className={styles.delete_button}
            icon={minusIcon}
            onClick={() => deleteFavorite(favorite.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderDetailFavorites;
