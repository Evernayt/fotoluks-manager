import { IconButton, NumberInput, NumberInputField } from '@chakra-ui/react';
import { Select } from 'components';
import { IBarcode } from 'models/api/moysklad/IBarcode';
import { FC, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import styles from './SupplyBarcodeItem.module.scss';

interface SupplyBarcodeItemProps {
  barcode: IBarcode;
  index: number;
  onChange: (barcode: IBarcode, index: number) => void;
  onDelete: (index: number) => void;
}

const barcodeStandards = [
  {
    value: 'ean13',
    label: 'EAN13',
  },
  {
    value: 'code128',
    label: 'Code128',
  },
  {
    value: 'ean8',
    label: 'EAN8',
  },
  {
    value: 'gtin',
    label: 'GTIN',
  },
  {
    value: 'upc',
    label: 'UPC',
  },
];

const SupplyBarcodeItem: FC<SupplyBarcodeItemProps> = ({
  barcode,
  index,
  onChange,
  onDelete,
}) => {
  const initialValue = Object.values(barcode)[0];

  const [value, setValue] = useState<string>(initialValue);

  const defaultStandard =
    barcodeStandards.find((x) => x.value === Object.keys(barcode)[0]) ||
    barcodeStandards[0];

  const changeHandler = (option = defaultStandard) => {
    if (initialValue === value) return;

    onChange({ [option.value]: value }, index);
  };

  const deleteHandler = () => {
    onDelete(index);
  };

  return (
    <div className={styles.container}>
      <Select
        options={barcodeStandards}
        defaultValue={defaultStandard}
        containerStyles={{ minWidth: '92px' }}
        dropdownIndicatorStyles={{ display: 'none' }}
        onChange={changeHandler}
      />
      <NumberInput
        value={value}
        defaultValue={value}
        min={0}
        onChange={setValue}
        onBlur={() => changeHandler()}
      >
        <NumberInputField />
      </NumberInput>
      <IconButton
        icon={
          <IconTrash
            className="link-icon"
            size={ICON_SIZE}
            stroke={ICON_STROKE}
          />
        }
        aria-label="delete"
        variant="ghost"
        onClick={deleteHandler}
      />
    </div>
  );
};

export default SupplyBarcodeItem;
