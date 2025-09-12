export const fetchAPKData = async () => {
  const response = await fetch('https://funenn.github.io/StashAPK/apkData.json');
  if (!response.ok) throw new Error('Failed to fetch APK data');
  return response.json();
};
