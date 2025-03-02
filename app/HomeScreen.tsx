import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { validateProjectId } from '../services/api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // ✅ Icon Library

const HomeScreen: React.FC = () => {
  const [ProjectId, setProjectId] = useState('');
  const [projectIdValid, setProjectIdValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleNavigate = async () => {
    if (ProjectId) {
      setIsLoading(true);
      try {
        const response = await validateProjectId(ProjectId, 'na');
        if (response.data.status === 'success') {
          router.push(`/SurveyDetailsScreen?ProjectId=${ProjectId}&surveyId=${response.data.data?.surveyId || ''}`);
        } else {
          setProjectIdValid(false);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Invalid Project ID',
            text2: 'Please enter a valid Project ID.',
            visibilityTime: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Error validating Project ID. Please try again.',
          visibilityTime: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Missing Fields',
        text2: 'Please enter the Project ID.',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Home' }} />
      <View style={styles.container}>
        {/* Card Container */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Enter your Project ID to continue</Text>

          {/* Project ID Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="business-center" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, !projectIdValid && styles.inputError]}
              placeholder="Project ID"
              placeholderTextColor="#888"
              value={ProjectId}
              onChangeText={(text) => {
                setProjectId(text);
                setProjectIdValid(true);
              }}
            />
          </View>

          {/* Proceed Button */}
          <TouchableOpacity style={styles.button} onPress={handleNavigate} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Proceed</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  card: {
    width: '90%',
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
