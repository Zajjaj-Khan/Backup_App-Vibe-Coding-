import Drawer from 'expo-router/drawer'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function DrawerLayout() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: "#e91e63",
        drawerHideStatusBarOnOpen: true,

      }}>
        <Drawer.Screen
          name="Home"
          options={{
            title: "Home",
            headerShown: true,
            headerTitleAlign: "center",
          }}
        />
         <Drawer.Screen
          name="Settings"
          options={{
            title: "Settings",
            headerShown: true,
            headerTitleAlign: "center",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}