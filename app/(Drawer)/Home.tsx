import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


  useEffect(() => {
    async function getPhotos() {
    if (permissionResponse?.status !== 'granted') {
      await requestPermission();
    }

    // Fetch all assets from the media library
    const fetchedAssets = await MediaLibrary.getAssetsAsync({
     mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video], // include both
      sortBy: [[MediaLibrary.SortBy.creationTime, false]], // descending (most recent)
      first: 100, 
    });

    setAssets(fetchedAssets?.assets);
  }
    getPhotos();
  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {assets && assets.map((asset) => (
          <View key={asset?.id} style={styles.albumContainer}>
            <Image source={{ uri: asset.uri }} style={{ width: 100, height: 100 }} />
            <Text>{asset?.filename}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});