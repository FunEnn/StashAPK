// APK文件解析工具
export interface APKInfo {
  name: string;
  icon: string;
  category: string;
  downloadUrl: string;
}

// 从文件名解析基本信息
export const parseAPKFromFileName = (fileName: string): Partial<APKInfo> => {
  const name = fileName.replace('.apk', '');

  // 简单的分类判断逻辑
  const getCategory = (name: string): string => {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('game') || nameLower.includes('play')) {
      return 'Games';
    } else if (nameLower.includes('music') || nameLower.includes('audio')) {
      return 'Music';
    } else if (nameLower.includes('video') || nameLower.includes('movie')) {
      return 'Video';
    } else if (nameLower.includes('photo') || nameLower.includes('camera')) {
      return 'Photography';
    } else if (nameLower.includes('social') || nameLower.includes('chat')) {
      return 'Social';
    } else if (nameLower.includes('tool') || nameLower.includes('utility')) {
      return 'Tools';
    } else if (nameLower.includes('comic') || nameLower.includes('manga')) {
      return 'Entertainment';
    } else {
      return 'Entertainment'; // 默认分类
    }
  };

  return {
    name: name,
    category: getCategory(name),
  };
};

// 解析APK文件并生成JSON数据
export const parseAPKFile = async (file: File): Promise<APKInfo | null> => {
  try {
    // 从文件名解析基本信息
    const basicInfo = parseAPKFromFileName(file.name);

    // 生成完整的APK信息
    const apkInfo: APKInfo = {
      name: basicInfo.name || 'Unknown App',
      icon: 'https://s2.loli.net/2025/09/05/sHNmMYuk4yB3jr9.jpg', // 默认图标
      category: basicInfo.category || 'Entertainment',
      downloadUrl: '', // 将在上传后设置
    };

    console.log('Parsed APK info:', apkInfo);
    return apkInfo;
  } catch (error) {
    console.error('Failed to parse APK file:', error);
    return null;
  }
};

// 将APK信息转换为apkData.json格式
export const convertToAPKDataFormat = (apkInfo: APKInfo) => {
  return {
    name: apkInfo.name,
    icon: apkInfo.icon,
    category: apkInfo.category,
    downloadUrl: apkInfo.downloadUrl,
  };
};
