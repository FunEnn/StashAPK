import { Alert, Linking, Pressable, Text, View } from 'react-native';
import ImageWithFallback from './common/ImageWithFallback';

interface APKItemProps {
  name: string;
  icon?: string; // 使icon属性可选
  downloadUrl: string;
}

export default function APKItem({ name, icon, downloadUrl }: APKItemProps) {
  // 默认图标
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
      android_ripple={{ color: '#e5e7eb' }}
      className="rounded-xl"
    >
      <View className="p-3 rounded-xl mb-3 border border-gray-200 dark:border-gray-700 items-center bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-800">
        <View className="mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <ImageWithFallback
            source={icon || defaultIcon}
            className="w-14 h-14 mx-auto rounded-md"
            contentFit="cover"
          />
        </View>
        <Text
          className="text-center text-xs font-semibold text-gray-700 dark:text-gray-200"
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    </Pressable>
  );
}
