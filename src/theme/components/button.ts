import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  minH: '35px',
});

const buttonTheme = defineStyleConfig({
  baseStyle,
});

export default buttonTheme;
