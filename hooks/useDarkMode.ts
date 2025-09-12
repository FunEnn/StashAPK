import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';

export function useDarkMode() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return colorScheme === 'dark';
  });

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleDarkMode = () => {
    const newMode = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newMode);
  };

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
