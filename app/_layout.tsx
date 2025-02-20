import { GestureHandlerRootView } from "react-native-gesture-handler";
import Footer from "@/components/Footer";
import { Stack } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
