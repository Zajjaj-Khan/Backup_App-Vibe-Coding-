// backgroundTask.js
import * as BackgroundFetch from 'expo-background-fetch';
import {
  BackgroundFetchStatus,
} from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import doFileUpload from './manualFileUpload';


const TASK_NAME = 'BACKGROUND_UPLOAD_TASK';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log('[BackgroundFetch] Running task...');
    await doFileUpload();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[BackgroundFetch] Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  const status = await BackgroundFetch.getStatusAsync();

  if (status === BackgroundFetchStatus.Restricted || status === BackgroundFetchStatus.Denied) {
    console.log('Background fetch is disabled');
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 30, // 30 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Task registered');
  }
}

export async function unregisterBackgroundTask() {
  await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  console.log('Task unregistered');
}