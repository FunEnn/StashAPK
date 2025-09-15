import * as Updates from 'expo-updates';

export async function isUpdateAvailable(): Promise<boolean> {
  try {
    if (__DEV__) {
      return false;
    }
    const result = await Updates.checkForUpdateAsync();
    return Boolean(result.isAvailable);
  } catch {
    return false;
  }
}

export async function applyUpdate(): Promise<boolean> {
  try {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
    return true;
  } catch {
    return false;
  }
}
