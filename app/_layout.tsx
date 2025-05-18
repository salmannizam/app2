
//_layout.tsx
import 'react-native-gesture-handler'; // ✅ Add this at the top
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Footer from "@/components/Footer";
import { Stack } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {


  useEffect(() => {
    let prevState = AppState.currentState;
    
    const subscription = AppState.addEventListener('change', async (nextState) => {
      // App is being closed completely
      if (prevState === 'active' && nextState === 'inactive') {
        // User manually closed the app
        await AsyncStorage.multiRemove(['HomeScreenData', 'manuallyClosed', ...Object.keys(await AsyncStorage.getAllKeys())]);
      }
      
      // App going to background (keep data)
      if (prevState === 'active' && nextState === 'background') {
        console.log("App backgrounded - keeping data");
      }
      
      // App coming back from background (keep data)
      if (prevState === 'background' && nextState === 'active') {
        console.log("App returning from background");
      }
  
      prevState = nextState;
    });
  
    return () => subscription.remove();
  }, []);
  
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>

        <PaperProvider theme={MD3LightTheme}>
          <Stack
            screenOptions={{
              headerShown: true, // Show the header
              headerStyle: { backgroundColor: "#1D3C6B" }, // Header background color
              headerTintColor: "#FFFFFF", // Header text color
              headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
            }}
          />
          <Footer />
          <Toast />
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
