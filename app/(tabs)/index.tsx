import { applyUpdate, isUpdateAvailable } from '@/lib/utils/updates';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TextInput, View } from 'react-native';
import APKList from '../../components/APKList';
import { CustomAlert } from '../../components/common/CustomAlert';
import DarkModeToggle from '../../components/DarkModeToggle';
import { fetchAPKData } from '../../lib/api';
import { useTheme } from '../../hooks/ThemeContext';

export default function HomeScreen() {
  const [apks, setApks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{
    title: string;
    message: string;
    buttons: {
      text: string;
      onPress: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }[];
  }>({
    title: '',
    message: '',
    buttons: [],
  });

  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadAPKs();
    checkForUpdates();
  }, []);

  const loadAPKs = async () => {
    try {
      const data = await fetchAPKData();
      setApks(data);
    } catch (error) {
      Alert.alert('Error', '无法加载APK数据');
    } finally {
      setLoading(false);
    }
  };

  async function checkForUpdates() {
    try {
      const available = await isUpdateAvailable();
      if (!available) return;

      setUpdateInfo({
        title: '发现新版本',
        message: '是否立即更新到最新版本？',
        buttons: [
          {
            text: '稍后更新',
            style: 'cancel',
            onPress: () => setShowUpdateAlert(false),
          },
          {
            text: '立即更新',
            onPress: async () => {
              const ok = await applyUpdate();
              if (!ok) {
                setUpdateInfo({
                  title: '更新失败',
                  message: '请稍后重试',
                  buttons: [
                    {
                      text: '确定',
                      onPress: () => setShowUpdateAlert(false),
                    },
                  ],
                });
              }
            },
          },
        ],
      });
      setShowUpdateAlert(true);
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  }

  const filteredApks = apks.filter(apk => apk.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <View
        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900"
        style={{ paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0 }}
      >
        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            placeholder="搜索应用..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            value={search}
            onChangeText={setSearch}
          />
          <DarkModeToggle />
        </View>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={isDarkMode ? '#3b82f6' : '#0000ff'} />
          </View>
        ) : apks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 dark:text-gray-400">暂无APK数据</Text>
          </View>
        ) : (
          <APKList apks={filteredApks} />
        )}
      </View>

      <CustomAlert
        visible={showUpdateAlert}
        title={updateInfo.title}
        message={updateInfo.message}
        buttons={updateInfo.buttons}
        onDismiss={() => setShowUpdateAlert(false)}
      />
    </>
  );
}
