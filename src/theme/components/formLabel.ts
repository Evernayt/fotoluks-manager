import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  marginBottom: '6px',
});

const formLabelTheme = defineStyleConfig({
  baseStyle,
});

export default formLabelTheme;
