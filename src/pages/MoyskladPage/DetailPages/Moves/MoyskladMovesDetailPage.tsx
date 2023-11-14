import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { MoyskladAssortmentsSearch, SelectButton } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IPosition } from 'models/api/moysklad/IPosition';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { moveSlice } from 'store/reducers/MoveSlice';
import MoveDetailNavmenu from './Navmenu/MoveDetailNavmenu';
import styles from './MoyskladMovesDetailPage.module.scss';
import MoyskladMovesDetailTable from './Table/MoyskladMovesDetailTable';
import { Placements } from 'helpers/calcPlacement';
import { IShop } from 'models/api/IShop';
import { INITIAL_SHOP } from 'constants/states/shop-states';

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

  const stores = useAppSelector((state) => state.moysklad.stores);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const shops = useAppSelector((state) => state.app.shops);
  const department = useAppSelector((state) => state.move.department);
  const employee = useAppSelector((state) => state.employee.employee);

  const [sourceShop, setSourceShop] = useState<IShop>(activeShop);
  const [targetShop, setTargetShop] = useState<IShop>(INITIAL_SHOP);

  useLayoutEffect(() => {
    const filteredShops = shops.filter((shop) => shop.id !== sourceShop.id);
    setTargetShop(filteredShops.length > 0 ? filteredShops[0] : INITIAL_SHOP);
  }, []);

  useEffect(() => {
    if (sourceShop.id === targetShop.id) {
      const filteredShops = shops.filter((shop) => shop.id !== sourceShop.id);
      setTargetShop(filteredShops.length > 0 ? filteredShops[0] : INITIAL_SHOP);
    }
  }, [sourceShop]);

  useEffect(() => {
    if (sourceShop.id === targetShop.id) {
      const filteredShops = shops.filter((shop) => shop.id !== targetShop.id);
      setSourceShop(filteredShops.length > 0 ? filteredShops[0] : INITIAL_SHOP);
    }
  }, [targetShop]);

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
    const sourceStore = stores.find((store) =>
      store.name.includes(sourceShop.name)
    );
    const targetStore = stores.find((store) =>
      store.name.includes(targetShop.name)
    );

    if (!sourceStore) {
      showGlobalMessage(`Склад ${sourceShop.name} не найден`);
      return;
    } else if (!targetStore) {
      showGlobalMessage(`Склад ${targetShop.name} не найден`);
      return;
    } else {
      const description = `${sourceShop.abbreviation} -> ${targetShop.abbreviation} (Отдел: ${department?.name}, Сотрудник: ${employee?.name})`;
      MoyskladAPI.createMove({
        sourceStore,
        targetStore,
        description,
      }).then((data) => {
        setId(data.id);
        setDate(data.created);

        addAssortment(assortment, data.id);
      });
    }
  };

  return (
    <div className={styles.container}>
      <MoveDetailNavmenu date={date} />
      <div className={styles.add_card}>
        <div className={styles.controls_container}>
          <div className={styles.controls}>
            <div>Со склада</div>
            <SelectButton
              items={shops}
              defaultSelectedItem={sourceShop}
              onChange={setSourceShop}
              placement={Placements.bottomEnd}
            />
          </div>
          <div className={styles.controls}>
            <div>На склад</div>
            <SelectButton
              items={shops}
              defaultSelectedItem={targetShop}
              onChange={setTargetShop}
              placement={Placements.bottomEnd}
            />
          </div>
        </div>

        <MoyskladAssortmentsSearch
          disabled={sourceShop === INITIAL_SHOP || targetShop === INITIAL_SHOP}
          onChange={addAssortment}
        />
      </div>
      <div className={styles.table_card}>
        <MoyskladMovesDetailTable id={id} />
      </div>
    </div>
  );
};

export default MoyskladMovesDetailPage;
