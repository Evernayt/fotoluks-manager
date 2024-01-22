import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  body: {
    padding: '16px',
  },
});

const cardTheme = defineStyleConfig({
  baseStyle,
});

export default cardTheme;
