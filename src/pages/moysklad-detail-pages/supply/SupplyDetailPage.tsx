import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SupplyNavbar from './components/detail-navbar/SupplyNavbar';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { Button, Card, CardBody, useToast } from '@chakra-ui/react';
import { MoyskladAssortmentsSearch } from 'components';
import { getErrorToast } from 'helpers/toast';
import SupplyDataCard from './components/data-card/SupplyDataCard';
import SupplyDataModal from './modals/data-modal/SupplyDataModal';
import SupplyTable from './components/table/SupplyTable';
import { supplyActions } from 'store/reducers/SupplySlice';
import { CreateSupplyDto } from 'api/MoyskladAPI/dto/create-supply.dto';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IPosition } from 'models/api/moysklad/IPosition';
import { v4 as uuidv4 } from 'uuid';
import SupplyEditProductModal from './modals/edit-product-modal/SupplyEditProductModal';
import styles from './SupplyDetailPage.module.scss';

type LocationState = {
  state: {
    supplyId: string | undefined;
  };
};

const SupplyDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [supplyId, setSupplyId] = useState<string | undefined>(state.supplyId);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const supply = useAppSelector((state) => state.supply.supply);
  const positions = useAppSelector((state) => state.supply.positions);

  const dispatch = useAppDispatch();
  const toast = useToast();

  useLayoutEffect(() => {
    if (state.supplyId) {
      setIsLoading(true);
      MoyskladAPI.getSupply(state.supplyId)
        .then((data) => {
          setSupplyId(data.id);
          dispatch(supplyActions.setSupply(data));
        })
        .catch(() => toast(getErrorToast('SupplyDetailPage.getSupply')))
        .finally(() => setIsLoading(false));
    }
  }, []);

  // useEffect(() => {
  //   if (isDisabled) {
  //     toast(
  //       getErrorToast(
  //         'Нельзя провести перемещение со склада на этот же склад.',
  //         '',
  //         false
  //       )
  //     );
  //   } else {
  //     toast.closeAll();
  //   }
  // }, [isDisabled]);

  const createOrEditSupply = () => {
    setIsLoading(true);

    if (supplyId) {
      const updatedPositions = positions.map((position) =>
        position.isNewPosition ? { ...position, id: undefined } : position
      );
      MoyskladAPI.editSupply({
        ...supply,
        id: supplyId,
        positions: updatedPositions,
      })
        .then((data) => dispatch(supplyActions.setSupply(data)))
        .catch(() => toast(getErrorToast('SupplyDetailPage.editSupply')))
        .finally(() => setIsLoading(false));
    } else {
      MoyskladAPI.createSupply(supply as CreateSupplyDto)
        .then((data) => {
          setSupplyId(data.id);
          dispatch(supplyActions.setSupply(data));
          if (positions) {
            const createdPositions = positions.map((position) => {
              return { ...position, id: undefined };
            });
            MoyskladAPI.createSupplyPosition({
              id: data.id,
              positions: createdPositions,
            });
          }
        })
        .catch(() => toast(getErrorToast('SupplyDetailPage.createSupply')))
        .finally(() => setIsLoading(false));
    }
  };

  const addAssortment = (assortment: IAssortment) => {
    const position: IPosition = {
      id: uuidv4(),
      assortment,
      quantity: 1,
      price: assortment.buyPrice?.value || 0,
      stock: { quantity: assortment.stock || 0 },
      gtd: { name: '' },
      isNewPosition: true,
    };
    dispatch(supplyActions.addPosition(position));
  };

  return (
    <>
      <SupplyEditProductModal />
      <SupplyDataModal />
      <SupplyNavbar date={supply?.moment} onClose={() => {}} />
      <LoaderWrapper isLoading={isLoading} width="100%" height="100%">
        <div className={styles.container}>
          <div className={styles.cards}>
            <SupplyDataCard />
            <div className={styles.header_cards}>
              <Card className={styles.search}>
                <CardBody>
                  <MoyskladAssortmentsSearch
                    className={styles.search}
                    isDisabled={!supply?.agent || !supply.store}
                    showPrices
                    store={supply?.store}
                    onChange={addAssortment}
                  />
                </CardBody>
              </Card>
              <Card>
                <CardBody className={styles.controls}>
                  <Button
                    isDisabled={!supplyId}
                    onClick={() => console.log(positions)}
                  >
                    Создать перемещение
                  </Button>
                  <Button
                    colorScheme="yellow"
                    isDisabled={!supply?.agent || !supply.store}
                    onClick={createOrEditSupply}
                  >
                    {supplyId ? 'Сохранить' : 'Создать'}
                  </Button>
                </CardBody>
              </Card>
            </div>
            <Card className={styles.table}>
              <CardBody p={0}>
                <SupplyTable
                  id={supplyId}
                  setIsLoading={setIsLoading}
                  isDisabled={false}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </LoaderWrapper>
    </>
  );
};

export default SupplyDetailPage;
