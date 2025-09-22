import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useColorTheme();

  const iconName = isDarkMode ? 'sunny' : 'moon';
  const iconColor = isDarkMode ? '#fbbf24' : '#374151';

  return (
    <TouchableOpacity
      className="ml-3 p-3 rounded-xl active:bg-gray-200 dark:active:bg-gray-700 active:scale-95 transition-transform"
      onPress={toggleDarkMode}
    >
      <Ionicons name={iconName} size={24} color={iconColor} />
    </TouchableOpacity>
  );
}
