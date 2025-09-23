import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

interface FileUploadProps {
  onFileSelect: (file: any) => void;
  acceptedTypes?: string[];
  maxSize?: number; // MB
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = ['.apk'],
  maxSize = 50,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async () => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // 使用通用文件类型
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // 检查文件类型
        if (file.name && !file.name.toLowerCase().endsWith('.apk')) {
          Alert.alert('文件类型错误', '请选择APK文件');
          return;
        }

        // 检查文件大小
        if (file.size && file.size > maxSize * 1024 * 1024) {
          Alert.alert('文件过大', `文件大小不能超过 ${maxSize}MB`);
          return;
        }

        onFileSelect(file);
      }
    } catch (error) {
      console.error('文件选择错误:', error);
      Alert.alert('错误', '文件选择失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Pressable
      onPress={handleFileSelect}
      disabled={isUploading}
      className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-6 active:opacity-80 disabled:opacity-50"
    >
      <View className="items-center">
        <Ionicons name={isUploading ? 'hourglass' : 'cloud-upload'} size={32} color="#ffffff" />
        <Text className="text-white font-semibold text-lg mt-3">
          {isUploading ? '上传中...' : '选择APK文件'}
        </Text>
        <Text className="text-blue-100 text-sm mt-2 text-center">
          支持 .apk 格式，最大 {maxSize}MB
        </Text>
      </View>
    </Pressable>
  );
}
