import APKList from '@/components/APKList';
import { useSearchContext } from '@/contexts/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function SearchResults() {
  const { searchResults, searchQuery, performSearch } = useSearchContext();
  const { q } = useLocalSearchParams<{ q: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setIsLoading(true);
      try {
        await performSearch(query);
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [performSearch]
  );

  useEffect(() => {
    if (q && q !== searchQuery) {
      handleSearch(q);
    }
  }, [q, handleSearch, searchQuery]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">搜索中...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View className="p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              搜索 &ldquo;{q}&rdquo; 找到 {searchResults.length} 个结果
            </Text>
            <APKList apks={searchResults} />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="search" size={64} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium mt-4">
              没有找到相关应用
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center px-8">
              请尝试其他关键词或检查拼写
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
