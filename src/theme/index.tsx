import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { darkColors, lightColors, type ColorPalette } from './colors';
import { spacing, type SpacingScale } from './spacing';
import { typography, type Typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  colors: ColorPalette;
  spacing: SpacingScale;
  typography: Typography;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<Theme | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  followSystem?: boolean;
};

export function ThemeProvider({ children, initialMode, followSystem = true }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolveSystem = (scheme: ColorSchemeName): ThemeMode => (scheme === 'dark' ? 'dark' : 'light');

  const [mode, setMode] = useState<ThemeMode>(
    initialMode ?? resolveSystem(systemScheme)
  );

  useEffect(() => {
    if (!followSystem) return;
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(resolveSystem(colorScheme));
    });
    return () => subscription.remove();
  }, [followSystem]);

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value: Theme = useMemo(
    () => ({
      mode,
      colors: mode === 'dark' ? darkColors : lightColors,
      spacing,
      typography,
      setMode,
      toggleMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


