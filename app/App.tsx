import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import LottieView from 'lottie-react-native'; // Import Lottie for animation
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import SurveyDetailsScreen from './screens/SurveyDetailsScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';

// Create the Stack Navigator
const Stack = createStackNavigator();

// Footer Component
const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.iconWrapper}>
        <TouchableOpacity style={styles.iconContainer}>
          {/* <LottieView
            source={require('./assets/bg.json')} // Add your custom Lottie JSON file here
            autoPlay
            loop
            style={styles.iconAnimation}
          /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// App Component
const App = () => {
  return (
    <PaperProvider>
   
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1D3C6B', // Modern gradient header color
                shadowOpacity: 0, // Removes shadow for a clean look
                height: 100, // Set a specific height for the header if needed
              },
              headerTintColor: '#FFFFFF', // White text color
              // headerTitle: 'Survey', // Set header title
              headerTitleStyle: {
                fontFamily: 'Arial', // Clean font for title
                fontWeight: 'bold',
                fontSize: 24, // Larger header font size
              },
              headerTransparent: true, // Semi-transparent header
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Survey' }} />
            <Stack.Screen
              name="SurveyDetails"
              component={SurveyDetailsScreen}
              options={{
                headerTitle: 'Survey Details',
                // animationEnabled: true, // Enables transition animations
                gestureEnabled: true, // Allows swipe gestures for transition
                cardStyleInterpolator: ({ current, next, index }) => {
                  // Determine if the transition is backward
                  const isBack = index < 0; // Adjust this logic as needed

                  // Handle Forward Transition
                  if (!isBack) {
                    return {
                      cardStyle: {
                        opacity: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1], // Fade in as it moves
                        }),
                        transform: [
                          // {
                          //   translateX: current.progress.interpolate({
                          //     inputRange: [0, 1],
                          //     outputRange: [200, 0], // Slide from right to left
                          //   }),
                          // },
                          // {
                          //   scale: current.progress.interpolate({
                          //     inputRange: [0, 1],
                          //     outputRange: [0.5, 1], // Slight scaling effect
                          //   }),
                          // },
                        ],
                      },
                    };
                  }

                  // Handle Backward Transition
                  return {
                    cardStyle: {
                      opacity: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0], // Fade out as it moves backward
                      }),
                      transform: [
                        // {
                        //   translateX: current.progress.interpolate({
                        //     inputRange: [0, 1],
                        //     outputRange: [0, -600], // Slide from left to right (negative for back)
                        //   }),
                        // },
                        // {
                        //   scale: current.progress.interpolate({
                        //     inputRange: [0, 1],
                        //     outputRange: [1, 0.9], // Slight scaling effect when going back
                        //   }),
                        // },
                      ],
                    },
                  };
                },

              }}
            />
            {/* <Stack.Screen name="Questionnaire"
              component={QuestionnaireScreen}
              options={{
                headerTitle: 'Questionnaire',
                // animationEnabled: true, // Enables transition animations
                gestureEnabled: true, // Allows swipe gestures for transition
                cardStyleInterpolator: ({ current, next, index }) => {
                  // Determine if the transition is backward
                  const isBack = index < 0; // Adjust this logic as needed

                  // Handle Forward Transition
                  if (!isBack) {
                    return {
                      cardStyle: {
                        opacity: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1], // Fade in as it moves
                        }),
                        transform: [
                          // {
                          //   translateX: current.progress.interpolate({
                          //     inputRange: [0, 1],
                          //     outputRange: [200, 0], // Slide from right to left
                          //   }),
                          // },
                          // {
                          //   scale: current.progress.interpolate({
                          //     inputRange: [0, 1],
                          //     outputRange: [0.5, 1], // Slight scaling effect
                          //   }),
                          // },
                        ],
                      },
                    };
                  }

                  // Handle Backward Transition
                  return {
                    cardStyle: {
                      opacity: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0], // Fade out as it moves backward
                      }),
                      transform: [
                        // {
                        //   translateX: current.progress.interpolate({
                        //     inputRange: [0, 1],
                        //     outputRange: [0, -600], // Slide from left to right (negative for back)
                        //   }),
                        // },
                        // {
                        //   scale: current.progress.interpolate({
                        //     inputRange: [0, 1],
                        //     outputRange: [1, 0.9], // Slight scaling effect when going back
                        //   }),
                        // },
                      ],
                    },
                  };
                },

              }}
            /> */}
          </Stack.Navigator>

          {/* Footer added here */}
          <Footer />
        </View>

        {/* Configure Toast with custom styles */}
        <Toast
          config={{
            success: ({ text1, text2 }) => (
              <View style={[styles.toast, styles.toastSuccess]}>
                <Text style={styles.toastText}>{text1}</Text>
                <Text style={styles.toastSubText}>{text2}</Text>
              </View>
            ),
            error: ({ text1, text2 }) => (
              <View style={[styles.toast, styles.toastError]}>
                <Text style={styles.toastText}>{text1}</Text>
                <Text style={styles.toastSubText}>{text2}</Text>
              </View>
            ),
            info: ({ text1, text2 }) => (
              <View style={[styles.toast, styles.toastInfo]}>
                <Text style={styles.toastText}>{text1}</Text>
                <Text style={styles.toastSubText}>{text2}</Text>
              </View>
            ),
          }}
        />
      </NavigationContainer>
    </GestureHandlerRootView>
       
    </PaperProvider>
  );
};

// Styles for the UI
const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1D3C6B', // Footer dark gradient
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  iconWrapper: {
    position: 'absolute',
    top: -20, // Position the icon slightly above the footer
    alignSelf: 'center',
    zIndex: 2, // Ensure it is above the footer
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make the icon circular
    backgroundColor: '#fff', // Background for the icon
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  iconAnimation: {
    width: 40,
    height: 40,
  },
  // Toast Styles
  toast: {
    padding: 16,
    borderRadius: 8,
    width: '95%', // Force full width
    alignSelf: 'center', // Center horizontally
    position: 'absolute', // Position it absolutely to the screen
    top: 50, // Adjust the vertical position if needed
  },
  toastText: {
    color: '#fff', // Toast text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: '#fff', // Toast subtext color
    fontSize: 14,
    marginTop: 4,
  },
  toastSuccess: {
    backgroundColor: '#4CAF50', // Green background for success
  },
  toastError: {
    backgroundColor: '#FF6F61', // Red background for error
  },
  toastInfo: {
    backgroundColor: '#1E90FF', // Blue background for info
  },
});

export default App;
