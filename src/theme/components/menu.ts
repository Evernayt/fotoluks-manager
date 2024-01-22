import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  item: {
    py: '0.4rem',
    px: '0.8rem'
  },
});

const menuTheme = defineStyleConfig({
  baseStyle,
});

export default menuTheme;
