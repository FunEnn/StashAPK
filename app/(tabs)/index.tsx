import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View } from 'react-native';

import CustomAlert from '../../components/common/CustomAlert';

export default function HomeScreen() {
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
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    try {
      // 检查是否在开发环境中
      if (__DEV__) {
        console.log('开发环境中，跳过更新检查');
        return;
      }

      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
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
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch (error) {
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
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>funenn</Text>
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
