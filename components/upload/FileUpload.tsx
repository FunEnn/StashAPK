import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CustomAlert } from '../common/CustomAlert';

interface FileUploadProps {
  onFileSelect: (file: any) => void;
  acceptedTypes?: string[];
  maxSize?: number; // MB
  disabled?: boolean;
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = ['.apk'],
  maxSize = 100,
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
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
          showAlert('文件类型错误', '请选择APK文件', [
            { text: '确定', onPress: () => setAlertVisible(false) },
          ]);
          return;
        }

        // 检查文件大小
        if (file.size && file.size > maxSize * 1024 * 1024) {
          showAlert('文件过大', `文件大小不能超过 ${maxSize}MB`, [
            { text: '确定', onPress: () => setAlertVisible(false) },
          ]);
          return;
        }

        onFileSelect(file);
      }
    } catch (error) {
      console.error('文件选择错误:', error);
      showAlert('错误', '文件选择失败，请重试', [
        { text: '确定', onPress: () => setAlertVisible(false) },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
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

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertVisible(false)}
      />
    </>
  );
}
