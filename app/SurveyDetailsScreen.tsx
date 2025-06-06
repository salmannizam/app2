// SurveyDetailsScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, AppState } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';  // Importing Dialog from react-native-paper
import Toast from 'react-native-toast-message';
import { useFocusEffect, useLocalSearchParams, useRouter, useNavigation } from 'expo-router';  // ✅ Expo Router
import { getResultId } from '../services/api';
import { getCurrentDateTime } from '../services/dateUtils';
import SurveyDetailsStyles from '@/styles/SurveyDetailsStyle';
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearData, loadData, saveData } from '@/services/storageUtils';

const SurveyDetailsScreen = () => {
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('IN');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [outletName, setOutletName] = useState('');
  const [startZone, setStartZone] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();  // ✅ Use router instead of 
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const ProjectId = Array.isArray(params.ProjectId) ? params.ProjectId[0] : params.ProjectId;
  const surveyId = Array.isArray(params.surveyId) ? params.surveyId[0] : params.surveyId;

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await loadData(`SurveyDetails_${ProjectId}`);
      if (savedData) {
        setAddress(savedData.address || '');
        setCountry(savedData.country || 'IN');
        setLocation(savedData.location || '');
        setState(savedData.state || '');
        setOutletName(savedData.outletName || '');
        setStartZone(savedData.startZone || '');
      }
    };
  // Add app state listener for background/foreground transitions
  const subscription = AppState.addEventListener('change', async (nextState) => {
    if (nextState === 'active') {
      // App came back to foreground - reload data
      await loadSavedData();
    }
  });

  return () => subscription.remove();
  }, [ProjectId]);


  // Save data when any field changes
  useEffect(() => {
    const saveFormData = async () => {
      await saveData(`SurveyDetails_${ProjectId}`, {
        address,
        country,
        location,
        state,
        outletName,
        startZone
      });
    };
    saveFormData();
  }, [address, country, location, state, outletName, startZone, ProjectId]);



  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      // Don't clear if submitting (handled in handleSubmit)
      if (e.data.action.type !== 'NAVIGATE') {
        await clearData(`SurveyDetails_${ProjectId}`);
        resetAllState();
      }
    });
  
    return unsubscribe;
  }, [navigation, ProjectId]);

  useFocusEffect(
    useCallback(() => {
      resetAllState(); // Your function to clear everything
      return () => { }; // optional cleanup
    }, [])
  );

  const resetAllState = () => {
    setAddress("");
    setLocation("");
    setState("");
    setOutletName("");
    setIsModalVisible(false);
    // Reset other states as needed
  };
  // Handle zone selection
  const handleZoneSelect = (zone: string) => {
    setStartZone(zone);
    setIsModalVisible(false); // Close modal after selection
  };

  // Handle submit logic
  const handleSubmit = async () => {
    if (ProjectId && surveyId && address && country && location && outletName && startZone) {
      try {
        const response = await getResultId(ProjectId, surveyId, outletName);
        if (response.data.status === "success") {
          await clearData(`SurveyDetails_${ProjectId}`);

          const { FullDateTime, time, date } = getCurrentDateTime();
          const ResultID = response.data?.data?.resultId || FullDateTime;

          router.push(
            `/QuestionnaireScreen?ProjectId=${ProjectId}&SurveyID=${surveyId}&ResultID=${ResultID}&outletName=${outletName}&state=${state}&Location=${location}&Address=${address}&Zone=${startZone}&country=${country}&StartDate=${date}&StartTime=${time}`
          );

        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Something went wrong',
            visibilityTime: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Submission Failed',
          text2: 'An error occurred. Please try again.',
          visibilityTime: 3000,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Missing Fields',
        text2: 'Please fill all the fields.',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: "Survey Details" }} />
        <KeyboardAvoidingView
          style={SurveyDetailsStyles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={SurveyDetailsStyles.formContainer}>
            <Text style={SurveyDetailsStyles.title}>Pre-Survey Information</Text>

            {/* Input Fields */}
            <View style={SurveyDetailsStyles.inputContainer}>
              <Text style={SurveyDetailsStyles.label}>Address</Text>
              <TextInput
                style={SurveyDetailsStyles.input}
                placeholder="Enter Address"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={SurveyDetailsStyles.inputContainer}>
              <Text style={SurveyDetailsStyles.label}>State</Text>
              <TextInput
                style={SurveyDetailsStyles.input}
                placeholder="Enter State"
                value={state}
                onChangeText={setState}
              />
            </View>

            <View style={SurveyDetailsStyles.inputContainer}>
              <Text style={SurveyDetailsStyles.label}>Location</Text>
              <TextInput
                style={SurveyDetailsStyles.input}
                placeholder="Enter Location"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={SurveyDetailsStyles.inputContainer}>
              <Text style={SurveyDetailsStyles.label}>Outlet Name</Text>
              <TextInput
                style={SurveyDetailsStyles.input}
                placeholder="Enter Outlet Name"
                value={outletName}
                onChangeText={setOutletName}
              />
            </View>

            {/* Zone Selection Button */}
            <TouchableOpacity style={SurveyDetailsStyles.zoneButton} onPress={() => setIsModalVisible(true)}>
              <Text style={SurveyDetailsStyles.zoneButtonText}>
                {startZone || 'Select Zone'}
              </Text>
            </TouchableOpacity>

            {/* Modal for Zone Selection */}
            <Portal>
              <Dialog visible={isModalVisible} onDismiss={() => setIsModalVisible(false)}>
                <Dialog.Title>Select Zone</Dialog.Title>
                <Dialog.Content>
                  {['East', 'West', 'South', 'North'].map(zone => (
                    <Button
                      key={zone}
                      mode="outlined"
                      onPress={() => handleZoneSelect(zone)}
                      style={SurveyDetailsStyles.modalOptionButton}
                    >
                      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <Text style={SurveyDetailsStyles.modalOptionText}>{zone}</Text>
                      </View>

                    </Button>
                  ))}
                </Dialog.Content>
              </Dialog>
            </Portal>

            {/* Previous and Next Buttons */}
            <View style={SurveyDetailsStyles.buttonContainer}>
              <TouchableOpacity style={SurveyDetailsStyles.prevButton} onPress={() => router.back()}>
                <Text style={SurveyDetailsStyles.submitButtonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={SurveyDetailsStyles.nextButton} onPress={handleSubmit}>
                <Text style={SurveyDetailsStyles.submitButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );


};

export default SurveyDetailsScreen;
