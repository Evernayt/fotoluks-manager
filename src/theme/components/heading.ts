import { mode } from '@chakra-ui/theme-tools';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  fontFamily: 'Roboto, sans-serif',
});

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

const headingTheme = defineStyleConfig({
  baseStyle,
  variants: {
    secondary: secondaryVariant,
  },
});

export default headingTheme;
