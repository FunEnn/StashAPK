// Gitee API 上传服务
const GITEE_TOKEN = process.env.EXPO_PUBLIC_GITEE_TOKEN;
const GITEE_OWNER = process.env.EXPO_PUBLIC_GITEE_OWNER;
const GITEE_REPO = process.env.EXPO_PUBLIC_GITEE_REPO;

export interface UploadResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export interface ReleaseAsset {
  browser_download_url: string;
  name: string;
  size?: number;
  content_type?: string;
}

export interface ReleaseInfo {
  id: number;
  tag_name: string;
  name: string;
  assets: ReleaseAsset[];
}

// 获取Release的详细信息
export const getReleaseInfo = async (releaseId: number): Promise<ReleaseInfo | null> => {
  try {
    if (!GITEE_TOKEN || !GITEE_OWNER || !GITEE_REPO) {
      throw new Error('Gitee configuration not complete');
    }

    const response = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/${releaseId}`,
      {
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get release: ${response.statusText}`);
    }

    const release: ReleaseInfo = await response.json();
    console.log('Release info:', release);

    return release;
  } catch (error) {
    console.error('Error getting release info:', error);
    return null;
  }
};

// 获取Release的assets信息
export const getReleaseAssets = async (releaseId?: number): Promise<ReleaseAsset[]> => {
  try {
    if (!GITEE_TOKEN || !GITEE_OWNER || !GITEE_REPO) {
      throw new Error('Gitee configuration not complete');
    }

    // 如果没有提供releaseId，先获取v0.0.1的release信息
    let targetReleaseId = releaseId;
    if (!targetReleaseId) {
      const tagResponse = await fetch(
        `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/tags/v0.0.1`,
        {
          headers: {
            Authorization: `token ${GITEE_TOKEN}`,
          },
        }
      );

      if (tagResponse.ok) {
        const releaseInfo = await tagResponse.json();
        targetReleaseId = releaseInfo.id;
      } else {
        throw new Error('v0.0.1 release not found');
      }
    }

    const response = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/${targetReleaseId}`,
      {
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get release: ${response.statusText}`);
    }

    const release: ReleaseInfo = await response.json();
    console.log('Release assets:', release.assets);

    return release.assets || [];
  } catch (error) {
    console.error('Error getting release assets:', error);
    return [];
  }
};

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
    console.log('Preparing to upload file:', {
      fileName,
      fileUri: file.uri,
      fileSize: file.size,
      mimeType: file.mimeType,
      releaseId: release.id,
      uploadUrl: `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/${release.id}/attach_files`,
    });

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.mimeType || 'application/vnd.android.package-archive',
      name: fileName,
    } as any);

    // 根据Gitee API文档，可能需要添加access_token参数
    formData.append('access_token', GITEE_TOKEN);

    const uploadResponse = await fetch(
      `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${GITEE_REPO}/releases/${release.id}/attach_files`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${GITEE_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload failed:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`
      );
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload successful:', uploadResult);

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
