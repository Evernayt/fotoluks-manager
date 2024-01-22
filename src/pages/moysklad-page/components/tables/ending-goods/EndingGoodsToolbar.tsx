import { FC } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { IconClearAll, IconRefresh } from '@tabler/icons-react';
import { Toolbar } from 'components';
import Select, { ISelectOption } from 'components/ui/select/Select';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import EndingGoodsClearModal from 'pages/moysklad-page/modals/ending-goods/clear-modal/EndingGoodsClearModal';

interface EndingGoodsToolbarProps {
  reload: () => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions: ISelectOption[] = [
  {
    label: '25 позиций',
    value: 25,
  },
  {
    label: '50 позиций',
    value: 50,
  },
  {
    label: '100 позиций',
    value: 100,
  },
];

const EndingGoodsToolbar: FC<EndingGoodsToolbarProps> = ({
  reload,
  onLimitChange,
}) => {
  const clearModal = useDisclosure();

  const leftSection = () => {
    return (
      <>
        <Button
          leftIcon={<IconRefresh size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={reload}
        >
          Обновить
        </Button>
        <Button
          leftIcon={<IconClearAll size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={clearModal.onOpen}
        >
          Очистить заказанное
        </Button>
      </>
    );
  };

  const rightSection = () => {
    return (
      <>
        <Select
          options={limitOptions}
          defaultValue={limitOptions[0]}
          onChange={(option) => onLimitChange(option.value)}
        />
      </>
    );
  };

  return (
    <>
      <EndingGoodsClearModal
        isOpen={clearModal.isOpen}
        onClose={clearModal.onClose}
      />
      <Toolbar leftSection={leftSection()} rightSection={rightSection()} />
    </>
  );
};

export default EndingGoodsToolbar;
