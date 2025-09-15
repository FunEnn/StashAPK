const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://funenn.github.io/StashAPK/apkData.json';

export const fetchAPKData = async () => {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) throw new Error('Failed to fetch APK data');
  return response.json();
};
