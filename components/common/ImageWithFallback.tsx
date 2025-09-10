import { useState } from 'react';
import { Image, Text, View } from 'react-native';

interface ImageWithFallbackProps {
  source: string;
  className?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

export default function ImageWithFallback({
  source,
  className = 'w-16 h-16',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const defaultIcon = 'https://s2.loli.net/2025/09/05/sHNmMYuk4yB3jr9.jpg';

  const handleError = (error: any) => {
    console.error('Image load error:', error.nativeEvent?.error || error);
    setHasError(true);
  };

  // 使用提供的source，如果为空则使用默认图标
  const imageSource = source || defaultIcon;

  // 如果图片加载失败，显示默认图标
  if (hasError) {
    return <Image source={{ uri: defaultIcon }} className={className} fadeDuration={200} />;
  }

  return (
    <Image
      source={{ uri: imageSource }}
      className={className}
      onError={handleError}
      fadeDuration={200}
    />
  );
}
