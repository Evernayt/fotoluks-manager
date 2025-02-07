import SupplyBarcodeItem from './barcode-item/SupplyBarcodeItem';
import { FC, useRef } from 'react';
import { IBarcode } from 'models/api/moysklad/IBarcode';
import { Button } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import styles from './SupplyBarcodesFormField.module.scss';

interface SupplyBarcodesFormFieldProps {
  barcodes: IBarcode[];
  onChange: (barcodes: IBarcode[]) => void;
}

const SupplyBarcodesFormField: FC<SupplyBarcodesFormFieldProps> = ({
  barcodes,
  onChange,
}) => {
  const barcodesRef = useRef<null | HTMLDivElement>(null);

  const addBarcode = () => {
    let barcodesCopy: IBarcode[] = [...barcodes];
    barcodesCopy.push({ ean13: '' });
    onChange(barcodesCopy);

    setTimeout(() => {
      barcodesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const changeBarcode = (barcode: IBarcode, index: number) => {
    let barcodesCopy: IBarcode[] = [...barcodes];
    barcodesCopy[index] = barcode;
    onChange(barcodesCopy);
  };

  const deleteBarcode = (index: number) => {
    let barcodesCopy: IBarcode[] = [...barcodes];
    barcodesCopy.splice(index, 1);
    onChange(barcodesCopy);
  };

  return (
    <div className={styles.container}>
      <Button
        leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
        onClick={addBarcode}
      >
        Штрихкод
      </Button>
      <div className={styles.barcodes}>
        {barcodes.map((barcode: IBarcode, index: number) => (
          <SupplyBarcodeItem
            barcode={barcode}
            index={index}
            onChange={changeBarcode}
            onDelete={deleteBarcode}
            key={Object.values(barcode)[0] + index}
          />
        ))}
        <div ref={barcodesRef} />
      </div>
    </div>
  );
};

export default SupplyBarcodesFormField;
