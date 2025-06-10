import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import isServerAvailable from '../utils/network';
import startFileUpload from './UploadFile';
export default async function doFileUpload(callBack = () => {}) {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status !== 'granted') {
      console.warn('Media permissions not granted');
      callBack();
      return;
    }

    const serverOk = await isServerAvailable().catch(() => false);
    if (!serverOk) {
      console.warn('Server is not reachable');
      callBack();
      return;
    }

    let allAssets:any = [];
    let hasNextPage = true;
    let after = undefined;

    while (hasNextPage) {
      const page = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        first: 100,
        after,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      });

      allAssets = allAssets.concat(page.assets);
      hasNextPage = page.hasNextPage;
      after = page.endCursor ?? undefined;
    }

    // 🔍 Filter for .jpg and .mp4 only
    const mediaToUpload = allAssets.filter((asset:MediaLibrary.Asset) => {
      const name = asset.filename.toLowerCase();
      return name.endsWith('.jpg') || name.endsWith('.mp4');
    });

    if (mediaToUpload.length === 0) {
      console.log('No .jpg or .mp4 files found to upload.');
      callBack();
      return;
    }

    // 🚀 Upload each file
    for (let i = 0; i < mediaToUpload.length; i++) {
      const asset= mediaToUpload[i];
      const { uri, filename, mediaType } = asset;

      try {
        // Get file info using expo-file-system
        const fileInfo = await FileSystem.getInfoAsync(uri);

        if (!fileInfo.exists) {
          console.warn(`File does not exist: ${filename}`);
          continue;
        }

        // Pass the file URI and other info to startFileUpload
        await startFileUpload(
          {
            path: fileInfo.uri,  // Use the URI from getInfoAsync() (no `path` property here)
            headers: {
              'content-type': mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
              filePath: fileInfo.uri,  // Same URI, as it's the correct path
              fileName: filename,
            },
          },
          i,
          mediaToUpload.length,
          callBack
        );
      } catch (err) {
        console.error(`❌ Failed to upload ${filename}:`, err);
      }
    }

    callBack();
  } catch (err) {
    console.error('Unexpected error in doFileUpload:', err);
    callBack();
  }
}