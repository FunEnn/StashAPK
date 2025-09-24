import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface APKInfo {
  name: string;
  icon: string;
  category: string;
}

interface APKInfoCardProps {
  apkInfo: APKInfo;
  onInfoChange?: (updatedInfo: APKInfo) => void;
}

export default function APKInfoCard({ apkInfo, onInfoChange }: APKInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<APKInfo>(apkInfo);
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Games':
        return 'game-controller';
      case 'Music':
        return 'musical-notes';
      case 'Video':
        return 'videocam';
      case 'Photography':
        return 'camera';
      case 'Social':
        return 'people';
      case 'Tools':
        return 'construct';
      default:
        return 'apps';
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // 保存时保持图标不变，只更新名称和分类
    const updatedInfo = {
      ...editedInfo,
      icon: apkInfo.icon, // 保持原始图标不变
    };
    onInfoChange?.(updatedInfo);
  };

  const handleCancel = () => {
    setEditedInfo(apkInfo);
    setIsEditing(false);
  };

  const categoryOptions = ['Games', 'Music', 'Video', 'Photography', 'Social', 'Tools', 'Other'];

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">APK 文件信息</Text>
        <Pressable
          onPress={() => setIsEditing(!isEditing)}
          className="p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-700"
        >
          <Ionicons name={isEditing ? 'close' : 'create'} size={20} color="#3b82f6" />
        </Pressable>
      </View>

      <View className="space-y-3">
        {/* 应用名称 */}
        <View className="flex-row items-center">
          <Ionicons name="phone-portrait" size={20} color="#3b82f6" />
          <Text className="text-gray-600 dark:text-gray-400 ml-3 flex-1">应用名称:</Text>
          {isEditing ? (
            <TextInput
              value={editedInfo.name}
              onChangeText={text => setEditedInfo({ ...editedInfo, name: text })}
              className="text-gray-900 dark:text-gray-100 font-medium bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg flex-1"
              placeholder="输入应用名称"
            />
          ) : (
            <Text className="text-gray-900 dark:text-gray-100 font-medium">{apkInfo.name}</Text>
          )}
        </View>

        {/* 图标 */}
        <View className="flex-row items-center">
          <Ionicons name="image" size={20} color="#3b82f6" />
          <Text className="text-gray-600 dark:text-gray-400 ml-3 flex-1">图标:</Text>
          <Text className="text-gray-900 dark:text-gray-100 font-medium text-sm" numberOfLines={1}>
            {apkInfo.icon}
          </Text>
        </View>

        {/* 分类 */}
        <View className="flex-row items-center">
          <Ionicons
            name={getCategoryIcon(isEditing ? editedInfo.category : apkInfo.category)}
            size={20}
            color="#3b82f6"
          />
          <Text className="text-gray-600 dark:text-gray-400 ml-3 flex-1">分类:</Text>
          {isEditing ? (
            <View className="flex-row flex-wrap flex-1">
              {categoryOptions.map(category => (
                <Pressable
                  key={category}
                  onPress={() => setEditedInfo({ ...editedInfo, category })}
                  className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                    editedInfo.category === category
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      editedInfo.category === category
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text className="text-gray-900 dark:text-gray-100 font-medium">{apkInfo.category}</Text>
          )}
        </View>
      </View>

      {/* 编辑按钮 */}
      {isEditing && (
        <View className="flex-row justify-end mt-4 space-x-2">
          <Pressable
            onPress={handleCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
          >
            <Text className="text-gray-600 dark:text-gray-400 font-medium">取消</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 active:bg-blue-700"
          >
            <Text className="text-white font-medium">保存</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
