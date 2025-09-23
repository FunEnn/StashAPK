// Gitee API 上传服务
const GITEE_TOKEN = process.env.EXPO_PUBLIC_GITEE_TOKEN;
const GITEE_OWNER = process.env.EXPO_PUBLIC_GITEE_OWNER;
const GITEE_REPO = process.env.EXPO_PUBLIC_GITEE_REPO;

export interface UploadResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export const uploadToGitee = async (file: any, fileName: string): Promise<UploadResult> => {
  try {
    if (!GITEE_TOKEN || !GITEE_OWNER || !GITEE_REPO) {
      throw new Error(
        'Gitee configuration not complete. Please check GITEE_TOKEN, GITEE_OWNER, and GITEE_REPO environment variables'
      );
    }

    // 首先尝试获取现有的v0.0.1 release
    const getReleaseResponse = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/tags/v0.0.1`,
      {
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
        },
      }
    );

    let release;
    if (getReleaseResponse.ok) {
      // 如果v0.0.1 release存在，使用它
      release = await getReleaseResponse.json();
      console.log('Using existing v0.0.1 release:', release.id);
    } else {
      // 如果v0.0.1 release不存在，创建它
      console.log('Creating new v0.0.1 release');
      const createReleaseResponse = await fetch(
        `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${GITEE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tag_name: 'v0.0.1',
            name: 'APK Collection v0.0.1',
            body: `APK Collection Release v0.0.1\nCreated: ${new Date().toISOString()}`,
            prerelease: false,
          }),
        }
      );

      if (!createReleaseResponse.ok) {
        throw new Error(`Failed to create v0.0.1 release: ${createReleaseResponse.statusText}`);
      }

      release = await createReleaseResponse.json();
    }

    // 上传文件到release
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/${release.id}/attachments`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();

    return {
      success: true,
      downloadUrl: uploadResult.browser_download_url,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// 重新导出APK解析功能
export { convertToAPKDataFormat, parseAPKFile } from './apkParser';

export const updateAPKData = async (apkInfo: {
  name: string;
  icon: string;
  category: string;
  downloadUrl: string;
}): Promise<boolean> => {
  try {
    if (!GITEE_TOKEN || !GITEE_OWNER || !GITEE_REPO) {
      throw new Error(
        'Gitee configuration not complete. Please check GITEE_TOKEN, GITEE_OWNER, and GITEE_REPO environment variables'
      );
    }

    // 获取当前apkData.json文件内容
    const getFileResponse = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/contents/apkData.json?ref=apk-data-only`,
      {
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
        },
      }
    );

    if (!getFileResponse.ok) {
      throw new Error(`Failed to get file: ${getFileResponse.statusText}`);
    }

    const fileData = await getFileResponse.json();
    const currentContent = JSON.parse(atob(fileData.content));

    // 添加新的APK信息
    const newAPK = {
      name: apkInfo.name,
      icon: apkInfo.icon || 'https://s2.loli.net/2025/09/05/sHNmMYuk4yB3jr9.jpg',
      category: apkInfo.category || 'Entertainment',
      downloadUrl: apkInfo.downloadUrl,
    };

    // 检查是否已存在同名APK，如果存在则更新，否则添加
    const existingIndex = currentContent.findIndex((apk: any) => apk.name === newAPK.name);
    if (existingIndex >= 0) {
      currentContent[existingIndex] = newAPK;
    } else {
      currentContent.push(newAPK);
    }

    // 更新文件
    const updateResponse = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/contents/apkData.json`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update APK data: Add ${apkInfo.name}`,
          content: btoa(JSON.stringify(currentContent, null, 2)),
          sha: fileData.sha,
          branch: 'apk-data-only',
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update file: ${updateResponse.statusText}`);
    }

    console.log('APK data updated successfully:', apkInfo);
    return true;
  } catch (error) {
    console.error('Failed to update APK data:', error);
    return false;
  }
};
