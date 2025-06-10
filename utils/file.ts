import * as FileSystem from 'expo-file-system';

async function getFileStat(path: string) {
  // `path` is now a string (file URI)
  const result = await FileSystem.getInfoAsync(path);  // Get file information using expo-file-system
  return result;
}

const fileUtil = {
  getFileStat,
};

export default fileUtil;