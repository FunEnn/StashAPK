import { useSearchContext } from '@/contexts/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import DarkModeToggle from '../DarkModeToggle';
import SearchBar from '../search/SearchBar';

type AppHeaderProps = {
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onSearchChange?: (text: string) => void;
};

export default function AppHeader({ onHomePress, onSearchChange }: AppHeaderProps) {
  const { setSearch, performSearch } = useSearchContext();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const drawerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: showDrawer ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
    Animated.timing(drawerAnim, {
      toValue: showDrawer ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [showDrawer, toggleAnim, drawerAnim]);

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: showSearch ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSearch, searchAnim]);

  const handleChange = (text: string) => {
    setValue(text);
    setSearch(text);
    onSearchChange && onSearchChange(text);
  };

  const handleSearch = async () => {
    if (!value.trim()) return;

    try {
      await performSearch(value);
      router.push(`/search?q=${encodeURIComponent(value)}`);
      setShowSearch(false);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };
  return (
    <View
      className="mb-4 bg-cyan-500 dark:bg-cyan-700 shadow-lg shadow-cyan-600/30 dark:shadow-cyan-900/40 border-b border-cyan-400/40 dark:border-cyan-300/30 relative z-50 h-14"
      style={{ elevation: 50 }}
    >
      <View className="flex-row items-center px-3 h-full">
        <Pressable
          className="p-2 active:opacity-80"
          disabled={showSearch}
          onPress={() => {
            if (showSearch) return;
            setShowDrawer(prev => !prev);
            setShowSearch(false);
          }}
        >
          <View className="w-6 h-6">
            <Animated.View
              style={{
                position: 'absolute',
                opacity: toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                transform: [
                  {
                    rotate: toggleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '90deg'],
                    }),
                  },
                ],
              }}
            >
              <Ionicons name="menu" size={22} color="#ffffff" />
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                opacity: toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                transform: [
                  {
                    rotate: toggleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-90deg', '0deg'],
                    }),
                  },
                ],
              }}
            >
              <Ionicons name="close" size={22} color="#ffffff" />
            </Animated.View>
          </View>
        </Pressable>

        <View className="flex-1 items-center">
          <Pressable onPress={onHomePress} className="p-1 active:opacity-80">
            <Ionicons name="home" size={22} color="#ffffff" />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable
            className="p-2 active:opacity-80"
            disabled={showDrawer}
            onPress={() => {
              if (showDrawer) return;
              setShowSearch(prev => !prev);
              setShowDrawer(false);
            }}
          >
            <Ionicons name="search" size={22} color="#ffffff" />
          </Pressable>
        </View>
      </View>
      {showSearch ? (
        <Animated.View
          pointerEvents={'auto'}
          className="absolute left-0 right-0 top-full z-[200] shadow-lg overflow-hidden"
          style={{
            elevation: 200,
            opacity: searchAnim,
            transform: [
              { translateY: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) },
            ],
          }}
        >
          <View className="bg-gray-50 dark:bg-gray-900 border-t border-cyan-400/30 dark:border-cyan-300/20">
            <SearchBar
              value={value}
              onChangeText={handleChange}
              onSearch={handleSearch}
              onClear={() => handleChange('')}
              containerClassName="m-0"
            />
          </View>
        </Animated.View>
      ) : null}

      {/* Drawer panel with animated slide-down/fade */}
      {showDrawer ? (
        <Animated.View
          pointerEvents={'auto'}
          className="absolute left-0 top-full z-[200] overflow-hidden"
          style={{
            elevation: 200,
            opacity: drawerAnim,
            transform: [
              { translateY: drawerAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
            ],
          }}
        >
          <View className="w-72 bg-white dark:bg-gray-900 rounded-b-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <View className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">设置</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">应用配置与偏好</Text>
            </View>

            {/* Content */}
            <View className="px-6 py-4">
              {/* Dark Mode Toggle */}
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                    深色模式
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">切换应用主题</Text>
                </View>
                <DarkModeToggle />
              </View>

              <View className="h-px bg-gray-100 dark:bg-gray-800 mb-4" />

              {/* Close Menu */}
              <Pressable
                className="flex-row items-center justify-between py-3"
                onPress={() => setShowDrawer(false)}
              >
                <View className="flex-row items-center">
                  <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                    关闭菜单
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
