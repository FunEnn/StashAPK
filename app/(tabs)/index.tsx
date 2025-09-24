import { applyUpdate, isUpdateAvailable } from '@/lib/utils/updates';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import APKList from '../../components/APKList';
import { CustomAlert } from '../../components/common/CustomAlert';
import { fetchAPKData } from '../../lib/api';

export default function HomeScreen() {
  const [apks, setApks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
    loadAPKs();
    checkForUpdates();
  }, []);

  const loadAPKs = async (isRefresh = false) => {
    try {
      const data = await fetchAPKData();
      setApks(data);
    } catch (error) {
      // 这里不需要显示错误提示，因为已经有空状态显示
      console.error('加载APK数据失败:', error);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAPKs(true);
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

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : apks.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <Text
                className="text-base text-gray-600 dark:text-gray-300 font-medium text-center"
                style={{ fontFamily: 'System' }}
              >
                暂无APK数据
              </Text>
            </View>
          </View>
        ) : (
          <APKList apks={apks} />
        )}
      </ScrollView>

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
