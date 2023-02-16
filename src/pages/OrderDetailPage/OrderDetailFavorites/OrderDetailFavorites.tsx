import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import { IconButton } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconMinus, IconPlus } from 'icons';
import { IFavorite } from 'models/api/IFavorite';
import { IFinishedProduct } from 'models/api/IFinishedProduct';
import { ISelectedParam } from 'models/api/ISelectedParam';
import { useEffect } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import styles from './OrderDetailFavorites.module.scss';

const OrderDetailFavorites = () => {
  const employee = useAppSelector((state) => state.employee.employee);
  const favorites = useAppSelector((state) => state.order.favorites);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    if (!employee) return;

    FavoriteAPI.getAll({ employeeId: employee.id }).then((data) => {
      dispatch(orderSlice.actions.setFavorites(data.rows));
    });
  };

  const openOrderDetailAddFavoriteModal = () => {
    dispatch(
      modalSlice.actions.openModal({ modal: 'orderDetailAddFavoriteModal' })
    );
  };

  const deleteFavorite = (favoriteId: number) => {
    FavoriteAPI.delete(favoriteId).then(() => {
      dispatch(orderSlice.actions.deleteFavoriteById(favoriteId));
    });
  };

  const addFinishedProduct = (favorite: IFavorite) => {
    if (!favorite.favoriteParams) return;

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
      price: favorite.type ? favorite.type.price : 0,
      comment: '',
      product: favorite.type?.product,
      type: favorite.type,
      selectedParams,
      folder: '',
    };

    dispatch(orderSlice.actions.addFinishedProduct(createdFinishedProduct));
    dispatch(
      orderSlice.actions.addFinishedProductsForCreate(createdFinishedProduct)
    );
  };

  return (
    <div className={styles.container}>
      <IconButton
        icon={<IconPlus className="secondary-icon" />}
        onClick={openOrderDetailAddFavoriteModal}
      />
      {favorites.map((favorite) => (
        <div className={styles.favorite_container} key={favorite.id}>
          <div
            className={styles.favorite_button}
            onClick={() => addFinishedProduct(favorite)}
          >
            {`${
              favorite.type?.product?.name
            } ${favorite.type?.name.toLowerCase()} ${favorite.favoriteParams?.map(
              (favoriteParam) => ' ' + favoriteParam.param.name.toLowerCase()
            )}`}
          </div>

          <IconButton
            className={styles.delete_button}
            style={{
              minHeight: '32px',
              padding: '4px',
            }}
            icon={<IconMinus className="secondary-icon" />}
            onClick={() => deleteFavorite(favorite.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderDetailFavorites;
