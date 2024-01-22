import { mode } from '@chakra-ui/theme-tools';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const colors = {
  secondaryFontColor: {
    lightMode: 'gray.600',
    darkMode: 'gray.400',
  },
};

const secondaryVariant = defineStyle((props) => {
  return {
    color: mode(
      colors.secondaryFontColor.lightMode,
      colors.secondaryFontColor.darkMode
    )(props),
  };
});

const textTheme = defineStyleConfig({
  variants: {
    secondary: secondaryVariant,
  },
});

export default textTheme;
