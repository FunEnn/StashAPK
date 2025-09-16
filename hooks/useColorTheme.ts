import { useColorScheme } from 'nativewind';

export function useColorTheme() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const toggleDarkMode = () => {
    toggleColorScheme();
  };

  return {
    isDarkMode: colorScheme === 'dark',
    toggleDarkMode,
  };
}
