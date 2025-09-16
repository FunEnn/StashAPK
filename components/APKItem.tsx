import { useColorTheme } from '@/hooks/useColorTheme';
import { Alert, Linking, Pressable, Text, View } from 'react-native';
import ImageWithFallback from './common/ImageWithFallback';

interface APKItemProps {
  name: string;
  icon?: string; // 使icon属性可选
  downloadUrl: string;
}

export default function APKItem({ name, icon, downloadUrl }: APKItemProps) {
  const { isDarkMode } = useColorTheme();
  const defaultIcon = 'https://s2.loli.net/2025/09/05/sHNmMYuk4yB3jr9.jpg';

  const handleDownload = async () => {
    if (downloadUrl) {
      try {
        await Linking.openURL(downloadUrl);
      } catch (error) {
        console.error('无法打开浏览器:', error);
        Alert.alert('错误', '无法打开下载链接，请稍后重试');
      }
    }
  };

  return (
    <Pressable
      onPress={handleDownload}
      android_ripple={{ color: isDarkMode ? '#1f2937' : '#e5e7eb' }}
      className="rounded-2xl overflow-hidden"
    >
      <View className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl border">
        <View className="h-28 overflow-hidden rounded-t-2xl">
          <ImageWithFallback
            source={icon || defaultIcon}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>

        {/* 名称 */}
        <View className="p-3">
          <Text
            className="text-gray-800 dark:text-gray-100 text-center text-sm font-medium"
            style={{ fontFamily: 'System' }}
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
