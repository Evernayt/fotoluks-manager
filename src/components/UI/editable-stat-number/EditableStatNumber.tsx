import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  StatNumber,
  useEditableControls,
} from '@chakra-ui/react';
import { IconPencil } from '@tabler/icons-react';
import { FC } from 'react';

interface EditableStatNumberProps {
  value: string;
  textAfter?: string;
  onChange: (value: string) => void;
}

const EditableStatNumber: FC<EditableStatNumberProps> = ({
  value,
  textAfter,
  onChange,
}) => {
  function EditableControls() {
    const { getEditButtonProps } = useEditableControls();

    return (
      <IconButton
        {...getEditButtonProps()}
        icon={<IconPencil size={14} />}
        aria-label="edit"
        isRound
        size="xs"
        ml={2}
      />
    );
  }

  return (
    <Editable
      display="flex"
      alignItems="center"
      isPreviewFocusable={false}
      value={value}
      onChange={onChange}
    >
      <Box fontSize="21px" fontWeight="600">
        <EditablePreview />
        <EditableInput />
      </Box>
      {textAfter && <StatNumber>{textAfter}</StatNumber>}
      <EditableControls />
    </Editable>
  );
};

export default EditableStatNumber;
