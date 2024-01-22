import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  borderRadius: 'md',
  m: '4px'
});

const tooltipTheme = defineStyleConfig({
  baseStyle,
});

export default tooltipTheme;
