import { useColorTheme } from '@/hooks/useColorTheme';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { CustomAlert } from './common/CustomAlert';
import ImageWithFallback from './common/ImageWithFallback';

interface APKItemProps {
  name: string;
  icon?: string; // 使icon属性可选
  downloadUrl: string;
}

export default function APKItem({ name, icon, downloadUrl }: APKItemProps) {
  const { isDarkMode } = useColorTheme();
  const defaultIcon = 'https://s2.loli.net/2025/09/05/sHNmMYuk4yB3jr9.jpg';
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    buttons: [] as {
      text: string;
      onPress: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }[],
  });

  const showAlert = (
    title: string,
    message: string,
    buttons: { text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive' }[]
  ) => {
    setAlertConfig({ title, message, buttons });
    setAlertVisible(true);
  };

  const handleDownload = async () => {
    if (downloadUrl) {
      try {
        await Linking.openURL(downloadUrl);
      } catch (error) {
        console.error('无法打开浏览器:', error);
        showAlert('错误', '无法打开下载链接，请稍后重试', [
          { text: '确定', onPress: () => setAlertVisible(false) },
        ]);
      }
    }
  };

  return (
    <Pressable
      onPress={handleDownload}
      android_ripple={{ color: isDarkMode ? '#374151' : '#e5e7eb' }}
      className="rounded-2xl overflow-hidden active:scale-95 transition-transform"
    >
      <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
        <View className="h-32 overflow-hidden rounded-t-2xl">
          <ImageWithFallback
            source={icon || defaultIcon}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>

        {/* 名称 */}
        <View className="p-4">
          <Text
            className="text-gray-800 dark:text-gray-100 text-center text-sm font-semibold leading-tight"
            style={{ fontFamily: 'System' }}
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertVisible(false)}
      />
    </Pressable>
  );
}
