import { extendTheme } from '@chakra-ui/react';
import '@fontsource/open-sans';
import '@fontsource/raleway';

const disabledStyles = {
  _disabled: {
    backgroundColor: 'ui.main',
  },
};

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    ui: {
      main: '#009688',
      secondary: '#EDF2F7',
      success: '#48BB78',
      danger: '#E53E3E',
      light: '#FAFAFA',
      dark: '#1A202C',
      darkSlate: '#252D3D',
      dim: '#A0AEC0',
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: 'ui.main',
          color: 'ui.light',
          _hover: {
            backgroundColor: '#00766C',
          },
          _disabled: {
            ...disabledStyles,
            _hover: {
              ...disabledStyles,
            },
          },
        },
        danger: {
          backgroundColor: 'ui.danger',
          color: 'ui.light',
          _hover: {
            backgroundColor: '#E32727',
          },
        },
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            _selected: {
              color: 'ui.main',
            },
          },
        },
      },
    },
  },
});

export default theme;
