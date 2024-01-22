import { defineStyleConfig } from '@chakra-ui/styled-system';

const modalTheme = defineStyleConfig({
  defaultProps: {
    size: 'sm',
    //@ts-ignore
    isCentered: true,
  },
});

export default modalTheme;
