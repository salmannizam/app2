import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { validateProjectId } from '../../services/api'; // Import your validateProjectId API
import Toast from 'react-native-toast-message';

// This type maps 'Home' and 'SurveyDetails' screens to their parameters
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SurveyDetails'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [ProjectId, setProjectId] = useState('');
  const [surveyId, setSurveyId] = useState('');
  const [projectIdValid, setProjectIdValid] = useState(true);
  const [surveyIdValid, setSurveyIdValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = async () => {
    // navigation.navigate('SurveyDetails', { ProjectId: '1', surveyId: '2' });
    if (ProjectId && surveyId) {
      setIsLoading(true);
      try {
        const response = await validateProjectId(ProjectId, surveyId);
        if (response.data.status === "success") {
          navigation.navigate('SurveyDetails', { ProjectId, surveyId: response.data.data.surveyId });
        } else {
          setProjectIdValid(false);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Invalid Product ID',
            text2: 'Please enter a valid Product ID.',
            visibilityTime: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Error validating Product ID. Please try again.',
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
        text2: 'Please enter both Product ID and Survey ID.',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ImageBackground style={styles.container}>
      {/* Product ID Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Project ID</Text>
        <TextInput
          style={[styles.input, !projectIdValid && styles.inputError]}
          placeholder="Enter Project ID"
          placeholderTextColor="#888"
          value={ProjectId}
          onChangeText={text => {
            setProjectId(text);
            setProjectIdValid(true);
          }}
        />
      </View>

      {/* Survey ID Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Survey ID</Text>
        <TextInput
          style={[styles.input, !surveyIdValid && styles.inputError]}
          placeholder="Enter Survey ID"
          placeholderTextColor="#888"
          value={surveyId}
          onChangeText={text => {
            setSurveyId(text);
            setSurveyIdValid(true);
          }}
        />
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigate}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Proceed</Text>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
