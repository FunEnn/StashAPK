export const fetchAPKData = async () => {
  const response = await fetch('https://funenn.github.io/apk-collection/apkData.json');
  if (!response.ok) throw new Error('Failed to fetch APK data');
  return response.json();
};
