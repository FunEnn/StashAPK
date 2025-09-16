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
      <View className="flex-row items-center rounded-xl border bg-white border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600">
        <TextInput
          className="flex-1 px-2 text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          style={{ fontFamily: 'System', fontSize: 15 }}
        />
        {value.length > 0 ? (
          <Pressable onPress={onClear} className="mr-2">
            <View className="dark:hidden">
              <Ionicons name="close" size={20} color="#9ca3af" />
            </View>
            <View className="hidden dark:flex">
              <Ionicons name="close" size={20} color="#d1d5db" />
            </View>
          </Pressable>
        ) : null}
        <Pressable onPress={onSearch} disabled={!value.trim()}>
          <View className="dark:hidden">
            <Ionicons name="search" size={20} color={value.trim() ? '#6b7280' : '#d1d5db'} />
          </View>
          <View className="hidden dark:flex">
            <Ionicons name="search" size={20} color={value.trim() ? '#d1d5db' : '#6b7280'} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
