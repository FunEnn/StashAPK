import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface ImageWithFallbackProps {
  source: string;
  className?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

export default function ImageWithFallback({
  source,
  className = 'w-16 h-16',
  contentFit = 'cover',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // 如果图片加载失败，显示默认图标
  if (hasError) {
    return (
      <View className={`${className} bg-gray-200 rounded-lg items-center justify-center`}>
        <Text className="text-gray-500 text-xs">📱</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: source }}
      className={className}
      contentFit={contentFit}
      onError={handleError}
      transition={200}
    />
  );
}
