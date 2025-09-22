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
      <View style={{ paddingTop }} className="flex-1 bg-blue-600 dark:bg-gray-900">
        <AppHeader onHomePress={() => router.push('/')} />
        <Tabs
          screenOptions={{
            tabBarStyle: { display: 'none' },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: '首页',
              tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </SearchProvider>
  );
}
