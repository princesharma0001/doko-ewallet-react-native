import { Platform } from 'react-native';

export type Typography = {
  fontFamily: string | undefined;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  weights: {
    regular: string;
    medium: string;
    bold: string;
  };
};

export const typography: Typography = {
  fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: undefined }),
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};


