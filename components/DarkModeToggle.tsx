import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useColorTheme();

  const iconName = isDarkMode ? 'sunny' : 'moon';
  const iconColor = isDarkMode ? '#fde047' : '#111827';

  return (
    <TouchableOpacity className={'ml-2 p-2'} onPress={toggleDarkMode}>
      <Ionicons name={iconName} size={22} color={iconColor} />
    </TouchableOpacity>
  );
}
