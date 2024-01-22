import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDefectiveGood } from 'models/IDefectiveGood';
import { FC } from 'react';
import {
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import { defectiveGoodsActions } from 'store/reducers/DefectiveGoodsSlice';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import styles from './DefectiveGoodsProduct.module.scss';

interface DefectiveGoodsProductProps {
  defectiveGood: IDefectiveGood;
}

const DefectiveGoodsProduct: FC<DefectiveGoodsProductProps> = ({
  defectiveGood,
}) => {
  const lastDefectiveGood = useAppSelector(
    (state) => state.defectiveGoods.lastDefectiveGood
  );

  const isLast = lastDefectiveGood?.id === defectiveGood.id;

  const dispatch = useAppDispatch();

  const quantityChangeHandler = (value: string) => {
    const intValue = Number(value);
    dispatch(
      defectiveGoodsActions.setQuantity({
        id: defectiveGood.id,
        quantity: Number.isNaN(intValue) ? defectiveGood.quantity : intValue,
      })
    );
  };

  const remove = () => {
    dispatch(defectiveGoodsActions.remove(defectiveGood.id));
  };

  return (
    <div className={styles.container}>
      <Text className={isLast ? styles.last : ''} as="b">
        {defectiveGood.assortment.article}
      </Text>
      <Text className={isLast ? styles.last : ''} w="100%">
        {defectiveGood.assortment.name}
      </Text>
      <NumberInput
        value={defectiveGood.quantity}
        min={0}
        onChange={quantityChangeHandler}
      >
        <NumberInputField maxW="130px" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <IconButton
        icon={
          <IconTrash
            className="link-icon"
            size={ICON_SIZE}
            stroke={ICON_STROKE}
          />
        }
        aria-label="remove"
        variant="ghost"
        onClick={remove}
      />
    </div>
  );
};

export default DefectiveGoodsProduct;
