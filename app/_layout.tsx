import Footer from "@/components/Footer";
import { Stack } from "expo-router";
// import { Provider as PaperProvider } from "react-native-paper";
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import Toast from "react-native-toast-message";
import { View } from "react-native";

export default function Layout() {
  return (
    <PaperProvider theme={MD3LightTheme}>  
      <View style={{ flex: 1 }}>
        <Stack   screenOptions={{
            headerShown: true, // Show the header
            headerStyle: {
              backgroundColor: "#1D3C6B", // Header background color
            },
            headerTintColor: "#FFFFFF", // Header text color
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "bold",
            },
          }} >
          {/* <Stack.Screen name="TestScreen" /> */}
          <Stack.Screen name="HomeScreen" options={{ title: "" }} />
          <Stack.Screen name="SurveyDetailsScreen"  options={{ title: "Survey Details" }} />
          <Stack.Screen name="QuestionnaireScreen"  options={{ title: "Questionnaire" }}/>
        </Stack>
        <Footer />
      </View>
      <Toast />
    </PaperProvider>
  );
}