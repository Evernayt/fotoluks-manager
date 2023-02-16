import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { MoyskladAssortmentsSearch } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IPosition } from 'models/api/moysklad/IPosition';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { moveSlice } from 'store/reducers/MoveSlice';
import MoveDetailNavmenu from './Navmenu/MoveDetailNavmenu';
import styles from './MoyskladMovesDetailPage.module.scss';
import MoyskladMovesDetailTable from './Table/MoyskladMovesDetailTable';

type LocationState = {
  state: {
    moveId?: string;
    created?: string;
  };
};

const MoyskladMovesDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [id, setId] = useState<string | undefined>(state.moveId);
  const [date, setDate] = useState<string | undefined>(state.created);

  const activeStore = useAppSelector((state) => state.moysklad.activeStore);
  const stores = useAppSelector((state) => state.moysklad.stores);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const shops = useAppSelector((state) => state.app.shops);
  const department = useAppSelector((state) => state.move.department);

  const dispatch = useAppDispatch();

  const addAssortment = (assortment: IAssortment, moveId = id) => {
    if (!moveId) {
      createMove(assortment);
      return;
    }

    const positions: IPosition[] = [{ quantity: 1, assortment }];
    MoyskladAPI.createMovePosition({ id: moveId, positions }).then((data) => {
      dispatch(moveSlice.actions.addPosition(data[0]));
    });
  };

  const createMove = (assortment: IAssortment) => {
    const targetStores = stores.filter((store) => store.id !== activeStore?.id);

    if (targetStores.length && activeStore) {
      const targetStore = targetStores[0];
      const targetShop = shops.find((shop) =>
        targetStore.name.includes(shop.name)
      );

      if (!targetShop) {
        showGlobalMessage('Филиал не найден');
        return;
      }

      const description = `[FM] ${activeShop.abbreviation} -> ${targetShop.abbreviation} (Отдел: ${department?.name})`;
      MoyskladAPI.createMove({
        sourceStore: activeStore,
        targetStore,
        description,
      }).then((data) => {
        setId(data.id);
        setDate(data.created);

        addAssortment(assortment, data.id);
      });
    } else {
      showGlobalMessage('Склады не найдены');
    }
  };

  return (
    <div className={styles.container}>
      <MoveDetailNavmenu date={date} />
      <div className={styles.add_card}>
        <MoyskladAssortmentsSearch onChange={addAssortment} />
      </div>
      <div className={styles.table_card}>
        <MoyskladMovesDetailTable id={id} />
      </div>
    </div>
  );
};

export default MoyskladMovesDetailPage;
