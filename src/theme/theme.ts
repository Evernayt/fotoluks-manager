import {
  extendTheme,
  StyleFunctionProps,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import components from './components';

const colors = {
  yellow: {
    50: '#FFFBE5',
    100: '#FFF3B8',
    200: '#FFEB8A',
    300: '#FFE45C',
    400: '#FFDC2E',
    500: '#FFD400',
    600: '#CCAA00',
    700: '#997F00',
    800: '#665500',
    900: '#332A00',
  },
  gray: {
    50: 'red',
    100: '#f5f4f0', //LIGHT --background-color
    200: '#e2e1dd', //LIGHT --border-color
    300: '#d4d3cd', //LIGHT --hover-border-color
    400: '#b8b7b0', //DARK --secondary-text-on-bg-color
    500: '#9e9d9b', //LIGHT --placeholder
    600: '#706d60', //LIGHT --secondary-text-on-bg-color
    700: '#262624', //DARK --card-color
    800: '#1a1a18', //DARK --background-color
    //900: 'red', //DARK --tooltip-color
  },
};

const config = {
  colors: { ...colors },
  components: { ...components },

  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('gray.100', 'gray.800')(props),
      },
    }),
  },
};

const theme = extendTheme(
  config,
  withDefaultColorScheme({ colorScheme: 'gray' })
);

export default theme;
