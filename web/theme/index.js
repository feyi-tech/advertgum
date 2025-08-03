import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    900: '#0D3B66', // Darkest Blue
    800: '#1A537E',
    700: '#286BA5',
    600: '#3582CC',
    500: '#4299E1', // Main Blue (Chakra's blue.500)
    400: '#63B3ED',
    300: '#90CDF4',
    200: '#BEE3F8',
    100: '#EBF8FF', // Lightest Blue
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'full',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'brand.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
            },
          },
        },
      },
    },
  },
});

export default theme;
