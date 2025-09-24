import APKList from '@/components/APKList';
import { useSearchContext } from '@/contexts/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function SearchResults() {
  const { searchResults, searchQuery, performSearch } = useSearchContext();
  const [isLoading, setIsLoading] = useState(false);
  const rotation = useSharedValue(0);

  // 配置旋转动画
  useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
    } else {
      rotation.value = 0;
    }
  }, [isLoading, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    // 当组件挂载时，如果有搜索查询，执行搜索
    if (searchQuery && searchQuery.trim()) {
      setIsLoading(true);
      performSearch(searchQuery).finally(() => {
        setIsLoading(false);
      });
    }
  }, [searchQuery, performSearch]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Animated.View
              style={animatedStyle}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">搜索中...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View className="p-6">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-lg">
              <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                搜索 &ldquo;{searchQuery}&rdquo; 找到 {searchResults.length} 个结果
              </Text>
            </View>
            <APKList apks={searchResults} />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20 px-8">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg items-center">
              <Ionicons name="search" size={64} color="#3b82f6" />
              <Text className="text-gray-600 dark:text-gray-300 text-lg font-semibold mt-6 text-center">
                没有找到相关应用
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-3 text-center leading-relaxed">
                请尝试其他关键词或检查拼写
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
