import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import APKInfoCard from '../../components/upload/APKInfoCard';
import FileUpload from '../../components/upload/FileUpload';
import {
  getReleaseAssets,
  getReleaseInfo,
  parseAPKFile,
  ReleaseAsset,
  ReleaseInfo,
  uploadToGitee,
} from '../../lib/upload';

export default function UploadScreen() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [parsedAPKInfo, setParsedAPKInfo] = useState<any>(null);
  const [releaseAssets, setReleaseAssets] = useState<ReleaseAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);

  // 获取Release assets
  const loadReleaseAssets = async (releaseId?: number) => {
    try {
      setLoadingAssets(true);
      const assets = await getReleaseAssets(releaseId);
      setReleaseAssets(assets);

      // 如果提供了releaseId，也获取Release的详细信息
      if (releaseId) {
        const info = await getReleaseInfo(releaseId);
        setReleaseInfo(info);
      }
    } catch (error) {
      console.error('Failed to load release assets:', error);
      Alert.alert('错误', '获取Release文件列表失败');
    } finally {
      setLoadingAssets(false);
    }
  };

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

      // 使用当前解析的APK信息（可能已被用户修改）
      const currentApkInfo = parsedAPKInfo || apkInfo;

      Alert.alert('上传中', '正在上传文件到Gitee v0.0.1...');

      // 2. 上传文件到Gitee Releases，使用修改后的名称
      const fileName = `${currentApkInfo.name}.apk`;
      const uploadResult = await uploadToGitee(file, fileName);

      if (uploadResult.success && uploadResult.downloadUrl) {
        // 3. 设置下载链接
        currentApkInfo.downloadUrl = uploadResult.downloadUrl;

        Alert.alert(
          '上传成功',
          `✅ 文件已上传到Gitee v0.0.1\n📱 应用名称: ${currentApkInfo.name}\n🔗 下载链接: ${uploadResult.downloadUrl}\n📝 `
        );

        // 刷新Release assets列表
        await loadReleaseAssets();
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
          <Text className="text-gray-600 dark:text-gray-400">
            上传APK文件到Gitee v0.0.1，数据将自动同步到GitHub
          </Text>
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
                      {parsedAPKInfo?.name || file.name}
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

        {/* Release Assets 列表 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Release 文件列表
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => loadReleaseAssets()}
                disabled={loadingAssets}
                className="bg-blue-600 px-4 py-2 rounded-lg active:opacity-80 disabled:opacity-50"
              >
                <Text className="text-white font-medium">
                  {loadingAssets ? '加载中...' : 'v0.0.1'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Release 信息显示 */}
          {releaseInfo && (
            <View className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Text className="text-blue-900 dark:text-blue-100 font-medium">
                Release: {releaseInfo.name}
              </Text>
              <Text className="text-blue-700 dark:text-blue-300 text-sm">
                Tag: {releaseInfo.tag_name} | ID: {releaseInfo.id}
              </Text>
            </View>
          )}

          {releaseAssets.length > 0 ? (
            <View className="space-y-3">
              {releaseAssets.map((asset, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="download" size={20} color="#3b82f6" />
                      <Text className="text-gray-900 dark:text-gray-100 font-medium ml-2">
                        {asset.name}
                      </Text>
                    </View>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      {asset.size ? formatFileSize(asset.size) : '未知大小'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Alert.alert('下载链接', asset.browser_download_url);
                    }}
                    className="bg-green-600 px-3 py-2 rounded-lg active:opacity-80"
                  >
                    <Text className="text-white font-medium text-sm">查看</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="cloud-download" size={48} color="#9ca3af" />
              <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center">
                暂无Release文件{'\n'}点击刷新按钮获取最新文件列表
              </Text>
            </View>
          )}
        </View>

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
