import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import APKInfoCard from '../../components/upload/APKInfoCard';
import FileUpload from '../../components/upload/FileUpload';
import {
  convertToAPKDataFormat,
  parseAPKFile,
  updateAPKData,
  uploadToGitee,
} from '../../lib/upload';

export default function UploadScreen() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [parsedAPKInfo, setParsedAPKInfo] = useState<any>(null);

  const handleFileSelect = async (file: any) => {
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uri: file.uri,
      type: file.mimeType,
      uploadTime: new Date().toISOString(),
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // 解析APK文件信息
    const apkInfo = await parseAPKFile(file);
    if (apkInfo) {
      setParsedAPKInfo(apkInfo);
    }

    Alert.alert(
      '文件已选择',
      `文件: ${file.name}\n大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      [
        { text: '确定', style: 'default' },
        {
          text: '上传到Gitee',
          onPress: () => uploadToGiteeHandler(newFile),
        },
      ]
    );
  };

  const uploadToGiteeHandler = async (file: any) => {
    try {
      Alert.alert('处理中', '正在解析APK文件...');

      // 1. 解析APK文件，转换为JSON格式
      const apkInfo = await parseAPKFile(file);
      if (!apkInfo) {
        Alert.alert('解析失败', '无法解析APK文件信息');
        return;
      }

      Alert.alert('上传中', '正在上传文件到Gitee v0.0.1...');

      // 2. 上传文件到Gitee Releases
      const uploadResult = await uploadToGitee(file, file.name);

      if (uploadResult.success && uploadResult.downloadUrl) {
        // 3. 设置下载链接
        apkInfo.downloadUrl = uploadResult.downloadUrl;

        Alert.alert('更新数据', '正在更新apk-data-only分支...');

        // 4. 转换为apkData.json格式并更新
        const apkDataFormat = convertToAPKDataFormat(apkInfo);
        const updateResult = await updateAPKData(apkDataFormat);

        if (updateResult) {
          Alert.alert(
            '上传成功',
            `✅ 文件已上传到Gitee v0.0.1\n📱 应用名称: ${apkInfo.name}\n🔗 下载链接: ${uploadResult.downloadUrl}\n📝 APK数据已更新到apk-data-only分支`
          );
        } else {
          Alert.alert('部分成功', '文件上传成功，但更新APK数据失败');
        }
      } else {
        Alert.alert('上传失败', uploadResult.error || '未知错误');
      }
    } catch (error) {
      console.error('上传失败:', error);
      Alert.alert('错误', '上传失败，请重试');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* 标题 */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">APK 上传</Text>
          <Text className="text-gray-600 dark:text-gray-400">上传APK文件到Gitee v0.0.1</Text>
        </View>

        {/* 上传区域 */}
        <View className="mb-8">
          <FileUpload onFileSelect={handleFileSelect} acceptedTypes={['.apk']} maxSize={50} />
        </View>

        {/* APK信息显示 */}
        {parsedAPKInfo && (
          <View className="mb-8">
            <APKInfoCard
              apkInfo={parsedAPKInfo}
              onInfoChange={updatedInfo => setParsedAPKInfo(updatedInfo)}
            />
          </View>
        )}

        {/* 已上传文件列表 */}
        {uploadedFiles.length > 0 && (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              已选择的文件
            </Text>

            {uploadedFiles.map(file => (
              <View
                key={file.id}
                className="flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3"
              >
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="document" size={20} color="#3b82f6" />
                    <Text className="text-gray-900 dark:text-gray-100 font-medium ml-2">
                      {file.name}
                    </Text>
                  </View>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatFileSize(file.size)} • {new Date(file.uploadTime).toLocaleString()}
                  </Text>
                </View>

                <Pressable
                  onPress={() => uploadToGiteeHandler(file)}
                  className="bg-blue-600 px-4 py-2 rounded-lg active:opacity-80"
                >
                  <Text className="text-white font-medium">上传</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* 说明信息 */}
        <View className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <Text className="text-blue-800 dark:text-blue-200 font-semibold ml-2">上传说明</Text>
          </View>
          <Text className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            • 支持 .apk 格式文件{'\n'}• 单个文件最大 50MB{'\n'}• 文件将上传到 Gitee v0.0.1{'\n'}•
            自动更新 apk-data-only 分支的 apkData.json
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
