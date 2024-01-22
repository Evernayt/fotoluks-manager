import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  container: {
    border: 0,
  },
  panel: {
    padding: '4px',
  },
});

const accordionTheme = defineStyleConfig({
  baseStyle,
});

export default accordionTheme;
