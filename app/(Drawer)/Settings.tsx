import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import {
  registerBackgroundTask,
  unregisterBackgroundTask,
} from "../../components/BackgroundTask";

export default function BackupSettingScreen() {
  const [serviceEnabled, setServiceEnabled] = useState(false);

  useEffect(() => {
    // Load saved value on mount
    const loadToggleState = async () => {
      try {
        const saved = await AsyncStorage.getItem("serviceEnabled");
        if (saved !== null) {
          setServiceEnabled(saved === "true");
        }
      } catch (error: any) {
        Alert.alert(
          "Error loading setting",
          error?.status || "Failed to load setting"
        );
      }
    };
    loadToggleState();
  }, []);

  const toggleBackupService = async () => {
    try {
      const newValue = !serviceEnabled;
      setServiceEnabled(newValue);
      await AsyncStorage.setItem("serviceEnabled", newValue.toString());

      // Call your background service start/stop logic here
      if (newValue) {
        await registerBackgroundTask();
      } else {
        await unregisterBackgroundTask();
        console.log("Backup service stopped");
      }
    } catch (error: any) {
      Alert.alert("Error saving setting", error?.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enable Backup Service</Text>
      <Switch
        value={serviceEnabled}
        onValueChange={toggleBackupService}
        trackColor={{ false: "#ccc", true: "#4CAF50" }}
        thumbColor={serviceEnabled ? "#fff" : "#f4f3f4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
