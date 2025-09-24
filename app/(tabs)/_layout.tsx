import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Tabs, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
import AppHeader from '../../components/header/AppHeader';
import { SearchProvider } from '../../contexts/SearchContext';

export default function TabLayout() {
  const router = useRouter();
  const paddingTop = Platform.OS === 'android' ? Constants.statusBarHeight : 0;
  return (
    <SearchProvider>
      <View style={{ paddingTop }} className="flex-1 bg-blue-600 dark:bg-gray-800">
        <AppHeader onHomePress={() => router.navigate('/')} />
        <Tabs
          screenOptions={{
            headerShown: true,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: '首页',
              tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: '搜索',
              tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="upload"
            options={{
              title: '上传',
              tabBarIcon: ({ color }) => <FontAwesome name="upload" size={24} color={color} />,
              headerShown: false,
            }}
          />
        </Tabs>
      </View>
    </SearchProvider>
  );
}
