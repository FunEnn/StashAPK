import { useTheme } from '@/hooks/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <TouchableOpacity
      className="ml-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      onPress={toggleDarkMode}
    >
      <Ionicons
        name={isDarkMode ? 'sunny' : 'moon'}
        size={24}
        color={isDarkMode ? '#f59e0b' : '#4b5563'}
      />
    </TouchableOpacity>
  );
}
