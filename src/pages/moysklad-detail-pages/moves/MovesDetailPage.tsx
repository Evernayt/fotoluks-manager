import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IPosition } from 'models/api/moysklad/IPosition';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IShop } from 'models/api/IShop';
import MoveNavbar from './components/detail-navbar/MoveNavbar';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  useToast,
} from '@chakra-ui/react';
import MoveTable from './components/table/MoveTable';
import { MoyskladAssortmentsSearch } from 'components';
import Select from 'components/ui/select/Select';
import { IMove } from 'models/api/moysklad/IMove';
import { getShopByStore, getStore, getStoreByShop } from 'helpers/moysklad';
import { moveActions } from 'store/reducers/MoveSlice';
import { IStore } from 'models/api/moysklad/IStore';
import { getEmployeeFullName } from 'helpers/employee';
import { getErrorToast, getSuccessToast } from 'helpers/toast';
import styles from './MovesDetailPage.module.scss';
import socketio from 'socket/socketio';

type LocationState = {
  state: {
    moveId: string | undefined;
    created: string | undefined;
  };
};

const MovesDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [moveId, setMoveId] = useState<string | undefined>(state.moveId);
  const [move, setMove] = useState<IMove | null>(null);
  const [searchStore, setSearchStore] = useState<IStore | null>(null);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeShop = useAppSelector((state) => state.app.activeShop);
  const [sourceShop, setSourceShop] = useState<IShop | null>(activeShop);
  const [targetShop, setTargetShop] = useState<IShop | null>(null);

  const shops = useAppSelector((state) => state.app.shops);
  const stores = useAppSelector((state) => state.moysklad.stores);
  const employee = useAppSelector((state) => state.employee.employee);

  const isDisabled = sourceShop?.id === targetShop?.id;

  const dispatch = useAppDispatch();
  const toast = useToast();

  useLayoutEffect(() => {
    if (state.moveId) {
      setIsLoading(true);
      MoyskladAPI.getMove(state.moveId)
        .then((data) => {
          if (data.deleted) {
            setIsDeleted(true);
            return;
          }
          setMoveId(data.id);
          setMove(data);

          const sourceStore = getStore(data.sourceStore, stores);
          const targetStore = getStore(data.targetStore, stores);

          const selectedSourceShop = getShopByStore(sourceStore, shops);
          const selectedTargetShop = getShopByStore(targetStore, shops);

          setSourceShop(selectedSourceShop);
          setTargetShop(selectedTargetShop);
          setSearchStore(sourceStore);
        })
        .catch(() => toast(getErrorToast('MovesDetailPage.getMove')));

      if (!employee) return;
      socketio.addMoveEditor({ employee, targetId: state.moveId });
    } else {
      const sourceStore = getStoreByShop(activeShop, stores);
      const filteredShops = shops.filter((shop) => shop.id !== activeShop.id);
      setTargetShop(filteredShops.length > 0 ? filteredShops[0] : null);
      setSearchStore(sourceStore);
    }
  }, []);

  useEffect(() => {
    if (isDisabled) {
      toast(
        getErrorToast(
          'Нельзя провести перемещение со склада на этот же склад.',
          '',
          false
        )
      );
    } else {
      toast.closeAll();
    }
  }, [isDisabled]);

  const addAssortment = (assortment: IAssortment, createdMove = move) => {
    if (!createdMove) {
      createMove(assortment);
      return;
    }

    const positions: IPosition[] = [{ quantity: 1, assortment }];
    MoyskladAPI.createMovePosition({ id: createdMove.id, positions }).then(
      (data) => {
        dispatch(moveActions.addPosition(data[0]));
      }
    );
  };

  const createMove = (assortment: IAssortment) => {
    const sourceStore = getStoreByShop(sourceShop, stores);
    const targetStore = getStoreByShop(targetShop, stores);
    if (!sourceStore) return;
    if (!targetStore) return;

    const description = `${sourceShop?.abbreviation} -> ${
      targetShop?.abbreviation
    } (Создано: ${getEmployeeFullName(employee)})`;
    MoyskladAPI.createMove({
      sourceStore,
      targetStore,
      description,
    }).then((data) => {
      setMove(data);
      addAssortment(assortment, data);
      toast(getSuccessToast('Перемещение создано'));

      if (!employee) return;
      socketio.addMoveEditor({ employee, targetId: data.id });
    });
  };

  const editMove = () => {
    if (isDeleted) return;

    const sourceStore = getStoreByShop(sourceShop, stores);
    const targetStore = getStoreByShop(targetShop, stores);
    if (!sourceStore) return;
    if (!targetStore) return;

    if (
      move?.sourceStore.meta.href !== sourceStore?.meta.href ||
      move.targetStore.meta.href !== targetStore?.meta.href
    ) {
      const description = `${sourceShop?.abbreviation} -> ${
        targetShop?.abbreviation
      } (Создано: ${getEmployeeFullName(employee)})`;
      MoyskladAPI.editMove({
        id: move?.id,
        sourceStore,
        targetStore,
        description,
      });
    }
  };

  const sourceShopChangeHandler = (shop: IShop) => {
    setSourceShop(shop);
    const sourceStore = getStoreByShop(shop, stores);
    setSearchStore(sourceStore);
  };

  const moveDetailClose = () => {
    toast.closeAll();
    editMove();
  };

  return (
    <>
      <MoveNavbar date={move?.created} onClose={moveDetailClose} />
      <LoaderWrapper isLoading={isLoading} width="100%" height="100%">
        <div className={styles.container}>
          {isDeleted ? (
            <Heading className={styles.message} size="md">
              Перемещение удалено
            </Heading>
          ) : (
            <div className={styles.cards}>
              <div className={styles.header_cards}>
                <Card flex={1.5}>
                  <CardBody>
                    <FormControl>
                      <FormLabel>Добавить позицию</FormLabel>
                      <MoyskladAssortmentsSearch
                        className={styles.search}
                        isDisabled={isDisabled || !sourceShop || !targetShop}
                        store={searchStore}
                        onChange={addAssortment}
                      />
                    </FormControl>
                  </CardBody>
                </Card>
                <Card flex={1}>
                  <CardBody className={styles.shops}>
                    <FormControl>
                      <FormLabel>Со склада</FormLabel>
                      <Select
                        placeholder="Со склада"
                        options={shops}
                        value={sourceShop}
                        defaultValue={sourceShop}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        onChange={sourceShopChangeHandler}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>На склад</FormLabel>
                      <Select
                        placeholder="На склад"
                        options={shops}
                        value={targetShop}
                        defaultValue={targetShop}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        onChange={setTargetShop}
                      />
                    </FormControl>
                  </CardBody>
                </Card>
              </div>
              <Card className={styles.table}>
                <CardBody p={0}>
                  <MoveTable
                    id={moveId}
                    setIsLoading={setIsLoading}
                    isDisabled={isDisabled || !sourceShop || !targetShop}
                  />
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </LoaderWrapper>
    </>
  );
};

export default MovesDetailPage;
