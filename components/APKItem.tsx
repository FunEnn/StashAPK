import { Alert, Linking, Pressable, Text, View } from 'react-native';
import ImageWithFallback from './common/ImageWithFallback';

interface APKItemProps {
  name: string;
  icon: string;
  downloadUrl: string;
}

export default function APKItem({ name, icon, downloadUrl }: APKItemProps) {
  // 默认图标
  const defaultIcon = 'https://img.cdn1.vip/i/68b9cd64d7dbd_1757007204.webp';

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
    <Pressable onPress={handleDownload}>
      <View className="bg-white p-4 rounded-2xl mb-3 shadow-md shadow-gray-200">
        <View className="bg-gray-100 rounded-xl p-2 mb-2">
          <ImageWithFallback
            source={icon || defaultIcon}
            className="w-16 h-16 mx-auto"
            contentFit="cover"
          />
        </View>
        <Text className="text-center text-sm font-medium text-gray-800" numberOfLines={1}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
}
