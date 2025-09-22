import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  placeholder?: string;
  containerClassName?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  onClear,
  placeholder = '搜索应用...',
  containerClassName = 'mb-4',
}: SearchBarProps) {
  return (
    <View className={containerClassName}>
      <View className="flex-row items-center rounded-2xl border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 px-4 py-3 shadow-lg">
        <TextInput
          className="flex-1 px-3 text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          style={{ fontFamily: 'System', fontSize: 16 }}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={onClear}
            className="mr-3 p-1 rounded-full active:bg-gray-200 dark:active:bg-gray-700"
          >
            <View className="dark:hidden">
              <Ionicons name="close" size={20} color="#9ca3af" />
            </View>
            <View className="hidden dark:flex">
              <Ionicons name="close" size={20} color="#d1d5db" />
            </View>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onSearch}
          disabled={!value.trim()}
          className="p-2 rounded-full active:bg-blue-100 dark:active:bg-gray-700"
        >
          <View className="dark:hidden">
            <Ionicons name="search" size={20} color={value.trim() ? '#3b82f6' : '#9ca3af'} />
          </View>
          <View className="hidden dark:flex">
            <Ionicons name="search" size={20} color={value.trim() ? '#60a5fa' : '#6b7280'} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
