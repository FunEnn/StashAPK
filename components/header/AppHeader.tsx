import { useSearchContext } from '@/contexts/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import DarkModeToggle from '../DarkModeToggle';
import SearchBar from '../search/SearchBar';

type AppHeaderProps = {
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onSearchChange?: (text: string) => void;
};

export default function AppHeader({ onHomePress, onSearchChange }: AppHeaderProps) {
  const { setSearch, performSearch } = useSearchContext();
  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const toggleAnim = useSharedValue(0);
  const drawerAnim = useSharedValue(0);
  const searchAnim = useSharedValue(0);

  useEffect(() => {
    toggleAnim.value = withTiming(showDrawer ? 1 : 0, { duration: 180 });
    drawerAnim.value = withTiming(showDrawer ? 1 : 0, { duration: 220 });
  }, [showDrawer, toggleAnim, drawerAnim]);

  useEffect(() => {
    searchAnim.value = withTiming(showSearch ? 1 : 0, { duration: 200 });
  }, [showSearch, searchAnim]);

  // 动画样式
  const menuIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(toggleAnim.value, [0, 1], [1, 0]),
    transform: [{ rotate: `${interpolate(toggleAnim.value, [0, 1], [0, 90])}deg` }],
  }));

  const closeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(toggleAnim.value, [0, 1], [0, 1]),
    transform: [{ rotate: `${interpolate(toggleAnim.value, [0, 1], [-90, 0])}deg` }],
  }));

  const searchPanelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(searchAnim.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(searchAnim.value, [0, 1], [-12, 0]) }],
  }));

  const drawerPanelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(drawerAnim.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(drawerAnim.value, [0, 1], [-8, 0]) }],
  }));

  const handleChange = (text: string) => {
    setValue(text);
    setSearch(text);
    onSearchChange && onSearchChange(text);
  };

  const handleSearch = async () => {
    if (!value.trim()) return;

    try {
      await performSearch(value);
      setShowSearch(false);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };
  return (
    <View
      className="bg-blue-600 dark:bg-gray-800 shadow-lg border-b border-blue-500/30 dark:border-gray-700/30 relative z-50 h-16"
      style={{ elevation: 50 }}
    >
      <View className="flex-row items-center px-3 h-full">
        <Pressable
          className="p-3 rounded-xl active:opacity-80 active:bg-white/10"
          disabled={showSearch}
          onPress={() => {
            if (showSearch) return;
            setShowDrawer(prev => !prev);
            setShowSearch(false);
          }}
        >
          <View className="w-6 h-6">
            <Animated.View
              style={[
                {
                  position: 'absolute',
                },
                menuIconStyle,
              ]}
            >
              <Ionicons name="menu" size={22} color="#ffffff" />
            </Animated.View>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                },
                closeIconStyle,
              ]}
            >
              <Ionicons name="close" size={22} color="#ffffff" />
            </Animated.View>
          </View>
        </Pressable>

        <View className="flex-1 items-center">
          <Pressable
            onPress={onHomePress}
            className="p-3 rounded-xl active:opacity-80 active:bg-white/10"
          >
            <Ionicons name="home" size={24} color="#ffffff" />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable
            className="p-3 rounded-xl active:opacity-80 active:bg-white/10"
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
          style={[
            {
              elevation: 200,
            },
            searchPanelStyle,
          ]}
        >
          <View className="bg-white dark:bg-gray-800 border-t border-blue-400/30 dark:border-gray-600/30">
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
          style={[
            {
              elevation: 200,
            },
            drawerPanelStyle,
          ]}
        >
          <View className="w-72 bg-white dark:bg-gray-800 rounded-b-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <View className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">设置</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">应用配置与偏好</Text>
            </View>

            {/* Content */}
            <View className="px-6 py-4">
              {/* Dark Mode Toggle */}
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    深色模式
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">切换应用主题</Text>
                </View>
                <DarkModeToggle />
              </View>

              <View className="h-px bg-gray-200 dark:bg-gray-700 mb-6" />

              {/* Close Menu */}
              <Pressable
                className="flex-row items-center justify-between py-4 px-3 rounded-xl active:bg-blue-50 dark:active:bg-gray-700"
                onPress={() => setShowDrawer(false)}
              >
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    关闭菜单
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
