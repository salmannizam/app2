import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { Button, Card, TextInput, Snackbar, IconButton } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-toast-message';
import Collapsible from 'react-native-collapsible'; // Add this import for collapsible functionality
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as FileSystem from 'expo-file-system';
import { Dialog, Portal } from 'react-native-paper';
import { getSubmittedSurveys, getSurveyQuestions, submitPreSurveyDetails } from '../services/api';
import { getCurrentDateTime } from '../services/dateUtils';
import { useLocalSearchParams } from 'expo-router';  // ✅ Expo Router
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SubmittedSurvey from '@/components/submitted-survey';
import * as ImageManipulator from 'expo-image-manipulator';

interface Answer {
  QuestionID: number;
  answer: string;
}

interface Survey {
  answers: Answer[];
}

const QuestionnaireScreen = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [imageUris, setImageUris] = useState<any>({}); // Track image per question
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); // Track only the currently open dropdown ID
  const [openAccordion, setOpenAccordion] = useState<{ [key: number]: boolean }>({}); // Track accordion state for image upload
  const [showImageUploads, setShowImageUploads] = useState(false); // Track whether to show image upload questions
  const [completedSurveys, setCompletedSurveys] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false); // For Submit button loading
  const [modalVisible, setModalVisible] = useState(false);

  const [imageprevModalVisible, setImageprevModalVisible] = useState(false);
  const [selectedPrevImage, setSelectedPrevImage] = useState<string | null>(null);
  const [activeDatePicker, setActiveDatePicker] = useState<number | null>(null); // Store active question ID for the picker

  const params = useLocalSearchParams();
  // const { ProjectId, outletName, SurveyID, ResultID, Location, Address, Zone, country, state, StartDate, StartTime } = params;

  const ProjectId = params.ProjectId?.toString() ?? "";
  const outletName = params.outletName?.toString() ?? "";
  const SurveyID = params.SurveyID?.toString() ?? "";
  const ResultID = params.ResultID?.toString() ?? "";
  const Location = params.Location?.toString() ?? "";
  const Address = params.Address?.toString() ?? "";
  const Zone = params.Zone?.toString() ?? "";
  const country = params.country?.toString() ?? "";
  const state = params.state?.toString() ?? "";
  const StartDate = params.StartDate?.toString() ?? "";
  const StartTime = params.StartTime?.toString() ?? "";


  useEffect(() => {
    setLoading(true)
    async function getQuestion() {
      try {
        // Fetch the survey questions from your API
        const response = await getSurveyQuestions(SurveyID);
        // console.log(response.data)
        // Check if the API response is successful
        if (response.data.status === "success") {
          // Sort questions by QuestionID in ascending order
          const sortedQuestions = response.data.data.sort((a: { QuestionID: number; }, b: { QuestionID: number; }) => a.QuestionID - b.QuestionID);
          // Set the sorted questions to state
          setQuestions(sortedQuestions);
          setLoading(false)
        } else {
          // Show an error toast if no questions were found
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Unable to get survey questions',
            visibilityTime: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching survey questions:', error);
        // Show a generic error toast if something goes wrong with the request
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error fetching survey questions',
          visibilityTime: 3000,
        });
      }
    }

    // Call the function to fetch questions
    getQuestion();
    getSubmittedSurvey(ProjectId, outletName)
    // const questionsData = require('../assets/questions.json');

    // // Sorting questions by QuestionID in ascending order
    // const sortedQuestions = questionsData.sort((a: { QuestionID: number; }, b: { QuestionID: number; }) => a.QuestionID - b.QuestionID);
    // // Setting the sorted questions to state
    // setQuestions(sortedQuestions);

  }, [SurveyID]); // Dependency array ensures it runs when SurveyID changes


  async function getSubmittedSurvey(ProjectId: string, outletName: string) {
    try {
      const response = await getSubmittedSurveys(ProjectId, outletName);
      if (response.data.status === "success") {
        setCompletedSurveys(response?.data?.data);
        // console.log("submittedd",response.data.data)
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Unable to get submitted surveys',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching submitted survey:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error fetching submitted surveys',
        visibilityTime: 3000,
      });
    }
  }

  const getPersistentDeviceId = async () => {
    let deviceId = await SecureStore.getItemAsync('deviceId');
    if (!deviceId) {
      // Generate a device ID based on platform-specific properties
      if (Device.osName === 'iOS') {
        const iosIdForVendor = await Application.getIosIdForVendorAsync();
        deviceId = iosIdForVendor;
      } else if (Device.osName === 'Android') {
        deviceId = await Application.getAndroidId();
      } else {
        // Fallback for other platforms
        deviceId = `device-${Math.random().toString(36).substring(7)}`;
      }
    }
    // Type assertion to tell TypeScript that deviceId will be a string here
    await SecureStore.setItemAsync('deviceId', deviceId as string);
    return deviceId || ''; // Ensure a fallback string if null
  };

  const createBase64FromUri = async (uri: string, questionId: string) => {
    try {
      // Use FileSystem to get the base64 encoded image from the URI
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      return base64String;
    } catch (error) {
      console.error("Error converting URI to Base64:", error);
      return null;
    }
  };


  const formatDate = (date: Date) => {
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate()}`;
  };


  const handleDateChange = (questionID: number, event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      handleAnswerChange(questionID, formatDate(date)); // Save selected date
    }
    setActiveDatePicker(null); // Always close the picker (on select or cancel)
  };


  const getAnswerDate = (questionID: string) => {
    const answer = answers.find((a) => a.QuestionID === questionID)?.answer;
    if (answer) {
      // Convert 'YYYYMMDD' to 'YYYY-MM-DD'
      const year = answer.slice(0, 4);
      const month = answer.slice(4, 6);
      const day = answer.slice(6, 8);
      return new Date(`${year}-${month}-${day}`);
    } else {
      return new Date(); // Return current date if no answer exists
    }
  };

  const calculateAging = (mfgdate: Date | null) => {
    if (!mfgdate) return 0; // Return 0 if no date is selected

    const currentDate = new Date();

    if (mfgdate > currentDate) return 0; // Return 0 if date is in the future

    const timeDifference = currentDate.getTime() - mfgdate.getTime(); // Difference in milliseconds
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

    return daysDifference;
  };


  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      const index = updatedAnswers.findIndex(a => a.QuestionID === questionId);
      if (index !== -1) {
        updatedAnswers[index].answer = answer;
      } else {
        updatedAnswers.push({ QuestionID: questionId, answer });
      }
      return updatedAnswers;
    });

    // Special case: If question ID is 10000057 and answer is "Yes", show image upload questions
    if (questionId === 10000057 && answer === 'Yes') {
      setShowImageUploads(true);
    } else if (questionId === 10000057 && answer === 'No') {
      setShowImageUploads(false);
    }
  };

  const handleSubmitSurvey = async () => {
    setSubmitting(true);
    const mandatoryQuestions = questions.filter(q => q.Mandatory === "Yes");

    const missingAnswers = mandatoryQuestions.some(q =>
      !answers.find(a => a.QuestionID === q.QuestionID)?.answer
    );

    if (missingAnswers) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Validation Error',
        text2: 'Please answer all mandatory questions before submitting.',
        visibilityTime: 3000,
      });
      setSubmitting(false);
      return;
    }

    // Get only date-type mandatory questions
    // const mandatoryDateQuestions = mandatoryQuestions.filter(q => q.Datatype === "Date");

    // const invalidDateAnswer = answers.some(a =>
    //   mandatoryDateQuestions.some(q => q.QuestionID === a.QuestionID) &&
    //   !/^\d{8}$/.test(a.answer) // Ensure YYYYMMDD format
    // );

    // if (invalidDateAnswer) {
    //   Toast.show({
    //     type: "error",
    //     position: "top",
    //     text1: "Invalid Date Format",
    //     text2: "Please enter a valid date in YYYYMMDD format.",
    //     visibilityTime: 3000,
    //   });
    //   setSubmitting(false);
    //   return;
    // }

    const { FullDateTime, date, time } = getCurrentDateTime();
    const deviceId = await getPersistentDeviceId();
    console.log("Device ID:", deviceId);  // This will now correctly log the device ID

    const formattedSurvey = answers.map((answer) => {
      // Find the corresponding question by QuestionID
      const question = questions.find((q) => q.QuestionID === answer.QuestionID);

      return {
        SurveyID: SurveyID || "",  // Replace with dynamic data if needed
        ResultID: ResultID,
        QuestionID: answer.QuestionID,
        AnswerID: question?.Choices
          ? (() => {
            const choiceIndex = question.Choices.findIndex((choice: { ChoiceText: any; }) => choice.ChoiceText === answer.answer);
            return choiceIndex !== -1 ? `${answer.QuestionID}-${choiceIndex + 1}` : '0';
          })()
          : '0', // For questions without options (User Input)
        AnswerText: answer.answer || "",
        Location: "", // Replace with dynamic data if needed
        Remarks: "",
        DeviceID: deviceId || "",  // Replace with dynamic data if needed
        ProjectId: ProjectId || "",  // Replace with dynamic data if needed
      };
    });


    const PreSurveyDetails = {
      SurveyID: SurveyID,
      ResultID: ResultID,
      Outlet_Name: outletName,
      State: state,
      // country: country,
      Location: Location,
      Address: Address,
      Zone: Zone,
      StartDate: StartDate,
      StartTime: StartTime,
      EndDate: date,
      EndTime: time,
      ProjectId: ProjectId,
    };

    // Prepare the JSON data (including base64 images)
    const surveyData: any = {
      ProjectId: ProjectId,
      PreSurveyDetails,
      answeredQuestions: formattedSurvey,
    };

    // Collect images
    const allImages: any = {};
    const imageUrisExist = Object.keys(imageUris).length > 0;
    const question10000057Answer = answers.find((a) => a.QuestionID === 10000057)?.answer;


    if (imageUrisExist && question10000057Answer === 'Yes') {
      const imagePromises = Object.keys(imageUris).map(async (questionId) => {
        const uri = imageUris[questionId];
        const base64Image = await createBase64FromUri(uri, questionId);
        if (base64Image) {
          allImages[questionId] = base64Image;
        }
      });

      await Promise.all(imagePromises);
      surveyData.images = allImages
    }

    // console.log(surveyData)

    // Submit the survey data to the server using axios
    try {
      const response = await submitPreSurveyDetails(surveyData);  // Pass FormData here
      // console.log(response)
      if (response.data.status === "success") {
        // console.log('Survey submitted successfully:', response.data);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Survey Submitted',
          text2: 'Your answers have been successfully submitted.',
          visibilityTime: 3000,
        });

        setAnswers([]);  // Clear the answers array
        setImageUris({}); // Clear the image URIs
        setShowImageUploads(false);  // Hide image upload questions
        setOpenAccordion({});  // Reset accordion state
        getSubmittedSurvey(ProjectId, outletName)
      } else {

        console.error('Error submitting survey:', response.data.message);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error Submitting Survey',
          text2: response.data.message || 'An error occurred while submitting your answers.',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error submitting survey:', error);

      // Extract error message
      let errorMessage = "An error occurred while submitting your answers.";
      if (error.response) {
        errorMessage = error.response.data?.message || "Server error occurred.";
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }

      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error Submitting Survey',
        text2: errorMessage,
        visibilityTime: 3000,
      });

    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (questionId: number) => {
    // Request media library permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      console.log('Permission to access camera or media library is required.');
      return;
    }

    // Show options for Camera or Gallery
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              let uri = result.assets[0].uri;

              // Get file info
              const info = await FileSystem.getInfoAsync(uri);
              if (info.exists && info.size) {
                let fileSizeInKB = info.size / 1024;
                // console.log(`Original Size: ${fileSizeInKB.toFixed(2)} KB`);

                // 👉 Compress if size > 500 KB
                if (fileSizeInKB > 500) {
                  console.log("Compressing to around 500 KB...");
                  let compressQuality = 0.7;  // Start with 70% quality

                  // Iteratively compress to reach ~500 KB
                  while (fileSizeInKB > 500 && compressQuality > 0.1) {
                    const compressedImage = await ImageManipulator.manipulateAsync(
                      uri,
                      [{ resize: { width: 1024 } }],  // Resize to max width of 1024px
                      { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
                    );

                    uri = compressedImage.uri;
                    const compressedInfo = await FileSystem.getInfoAsync(uri);
                    if (compressedInfo.exists && compressedInfo.size) {
                      fileSizeInKB = compressedInfo.size / 1024;
                      console.log(`Compressed to: ${fileSizeInKB.toFixed(2)} KB at ${compressQuality * 100}% quality`);
                    }

                    compressQuality -= 0.1;  // Reduce quality by 10% each step
                  }
                } else {
                  console.log("Size is already under 500 KB, no compression needed.");
                }

                setImageUris((prev: any) => ({ ...prev, [questionId]: uri }));
              } else {
                console.log("Failed to get file info.");
              }
            }
          },
        },
        {
          text: "Take Photo",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              let uri = result.assets[0].uri;

              // Get file info
              const info = await FileSystem.getInfoAsync(uri);
              if (info.exists && info.size) {
                let fileSizeInKB = info.size / 1024;
                console.log(`Original Size: ${fileSizeInKB.toFixed(2)} KB`);

                // 👉 Compress if size > 500 KB
                if (fileSizeInKB > 500) {
                  console.log("Compressing to around 500 KB...");
                  let compressQuality = 0.7;  // Start with 70% quality

                  // Iteratively compress to reach ~500 KB
                  while (fileSizeInKB > 500 && compressQuality > 0.1) {
                    const compressedImage = await ImageManipulator.manipulateAsync(
                      uri,
                      [{ resize: { width: 1024 } }],  // Resize to max width of 1024px
                      { compress: compressQuality, format: ImageManipulator.SaveFormat.JPEG }
                    );

                    uri = compressedImage.uri;
                    const compressedInfo = await FileSystem.getInfoAsync(uri);
                    if (compressedInfo.exists && compressedInfo.size) {
                      fileSizeInKB = compressedInfo.size / 1024;
                      console.log(`Compressed to: ${fileSizeInKB.toFixed(2)} KB at ${compressQuality * 100}% quality`);
                    }

                    compressQuality -= 0.1;  // Reduce quality by 10% each step
                  }
                } else {
                  console.log("Size is already under 500 KB, no compression needed.");
                }

                setImageUris((prev: any) => ({ ...prev, [questionId]: uri }));
              } else {
                console.log("Failed to get file info.");
              }
            }
          },
        },


      ]
    );

  };

  const renderRegularQuestions = (question: any) => {
    return (
      <Card key={question.QuestionID} style={styles.card}>
        <Card.Content>
          <Text style={styles.question}>{question.Question}</Text>

          {question.Questiontype === 'User Input' && (

            <>
              {question.Datatype === 'Date' && (

                <>
                  <TouchableOpacity onPress={() => setActiveDatePicker(question.QuestionID)} style={styles.datePickerButton}>
                    <Text>{answers.find(a => a.QuestionID === question.QuestionID)?.answer || 'Select a date'}</Text>
                  </TouchableOpacity>

                  {activeDatePicker === question.QuestionID && (
                    <DateTimePicker
                      value={getAnswerDate(question.QuestionID)}
                      mode="date"
                      display="default"
                      onChange={(event, date) => handleDateChange(question.QuestionID, event, date)}
                    />

                  )}

                  {getAnswerDate(question.QuestionID) && question.QuestionID == 10000055 && (
                    <Text> Aging: {calculateAging(getAnswerDate(question.QuestionID))} days </Text>
                  )}
                  <Text></Text>
                </>

              )}

              {question.Datatype === 'Number' && (
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                  onChangeText={(text) => handleAnswerChange(question.QuestionID, text)}
                  value={answers.find(a => a.QuestionID === question.QuestionID)?.answer || ''}
                />
              )}

              {question.Datatype === 'Text' && (
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  keyboardType="default"
                  onChangeText={(text) => handleAnswerChange(question.QuestionID, text)}
                  value={answers.find(a => a.QuestionID === question.QuestionID)?.answer || ''}
                />
              )}


            </>

          )}

          {question.Questiontype === 'Single Choice' && question.Choices && (
            <View>
              <TouchableOpacity
                key={`dropdown-${question.QuestionID}`}  // Unique key here
                onPress={() => setOpenDropdown(question.QuestionID)}
                style={styles.dropdownButton}
              >
                <Text>{answers.find(a => a.QuestionID === question.QuestionID)?.answer || 'Select an option'}</Text>
              </TouchableOpacity>

              {/* Dialog for Single Choice */}
              <Portal>
                <Dialog visible={openDropdown === question.QuestionID} onDismiss={() => setOpenDropdown(null)}>
                  <Dialog.Title>Select an Option</Dialog.Title>
                  <Dialog.Content style={{ maxHeight: 300 }}>
                    <ScrollView>
                      {question.Choices.map((choice: { ChoiceID: any; ChoiceText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: any) => (
                        <TouchableOpacity
                          key={`choice-${choice.ChoiceID || index}`}  // Unique key for each choice
                          style={styles.modalItem}
                          onPress={() => {
                            handleAnswerChange(question.QuestionID, choice.ChoiceText);
                            setOpenDropdown(null);
                          }}
                        >
                          <Text style={styles.modalItemText}>{choice.ChoiceText}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setOpenDropdown(null)}>Cancel</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          )}

          {question.Questiontype === 'Matrix' && question.Matrixtype === 'Drop Down' && question.Choices && (
            <View>
              <TouchableOpacity
                key={`dropdown-${question.QuestionID}`}  // Unique key here
                onPress={() => setOpenDropdown(question.QuestionID)}
                style={styles.dropdownButton}
              >
                <Text>{answers.find(a => a.QuestionID === question.QuestionID)?.answer || 'Select an option'}</Text>
              </TouchableOpacity>

              {/* Dialog for Matrix Drop Down */}
              <Portal>
                <Dialog visible={openDropdown === question.QuestionID} onDismiss={() => setOpenDropdown(null)}>
                  <Dialog.Title>Select an Option</Dialog.Title>
                  <Dialog.Content>
                    {question.Choices.map((choice: { ChoiceID: any; ChoiceText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: any) => (
                      <TouchableOpacity
                        key={`choice-${choice.ChoiceID || index}`}
                        style={styles.modalItem}
                        onPress={() => {
                          handleAnswerChange(question.QuestionID, choice.ChoiceText);
                          setOpenDropdown(null);
                        }}
                      >
                        <Text style={styles.modalItemText}>{choice.ChoiceText}</Text>
                      </TouchableOpacity>
                    ))}
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setOpenDropdown(null)}>Cancel</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          )}

        </Card.Content>
      </Card>
    );
  };

  const renderImageUploadQuestions = (question: any) => {
    return (
      <Card key={question.QuestionID} style={styles.card}>
        <Card.Content>
          <Text style={styles.question}>{question.Question}</Text>

          {question.Questiontype === 'Image' && (
            <View style={styles.accordionContainer}>
              <Button
                mode="outlined"
                onPress={() => setOpenAccordion(prev => ({ ...prev, [question.QuestionID]: !prev[question.QuestionID] }))}
                style={styles.accordionButton}
                labelStyle={styles.accordionButtonLabel}
              >
                {openAccordion[question.QuestionID] ? 'Hide' : 'Show'} Image Upload
              </Button>
              {openAccordion[question.QuestionID] && (
                <View style={styles.imageContainer}>
                  {/* <Text style={styles.imageText}>Upload Image</Text> */}
                  {imageUris[question.QuestionID] ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: imageUris[question.QuestionID] || undefined }}
                        style={styles.imagePreview}
                      />

                      {/* 👁️ View Button to Open Modal */}
                      <IconButton
                        icon="eye"
                        iconColor="#3498db"  // 🔄 Soft blue for professional look
                        onPress={() => {
                          setSelectedPrevImage(imageUris[question.QuestionID]);
                          setImageprevModalVisible(true);
                        }}
                        style={[styles.viewButton, styles.previewButton]}  // Added new style
                      />

                      {/* 🗑️ Cancel Button to Remove Image */}
                      <Button
                        mode="text"
                        icon="close-circle"
                        onPress={() => {
                          const updatedImageUris = { ...imageUris };
                          delete updatedImageUris[question.QuestionID];
                          setImageUris(updatedImageUris);  // 🟢 Remove image from state
                        }}
                        style={styles.removeButton}
                        labelStyle={{ color: 'red' }}
                      >
                        Remove Image
                      </Button>
                    </View>

                  ) : (
                    <>
                      <Text style={styles.imageText}>No image selected</Text>
                      <Button
                        key={`upload-${question.QuestionID}`} // Unique key here
                        icon="camera"
                        mode="contained"
                        onPress={() => handleImageUpload(question.QuestionID)}
                        style={styles.uploadButton}
                      >
                        Upload Image (Camera/Gallery)
                      </Button>
                    </>

                  )}


                </View>
              )}
            </View>
          )}
        </Card.Content>

        {/* 🌟 Professional Modal for Image Preview */}
        <Modal
  visible={imageprevModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setImageprevModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      {/* 🖼️ Full Image Inside Modal with Contain */}
      <Image
        source={{ uri: selectedPrevImage || undefined }}
        style={styles.modalImage}
        resizeMode="contain"
      />

      {/* ❌ Close Button */}
      <IconButton
        icon="close"
        iconColor="#fff"
        size={24}
        onPress={() => setImageprevModalVisible(false)}
        style={styles.closeIconButton}
      />
    </View>
  </View>
</Modal>


      </Card>
    );
  };



  // Separate image-upload and regular questions
  const regularQuestions = questions.filter(q => q.Questiontype !== 'Image');
  const imageUploadQuestions = questions.filter(q => q.Questiontype === 'Image' && showImageUploads);

  // Merge the regular questions first and then the image-upload questions
  const filteredQuestions = [...regularQuestions, ...imageUploadQuestions];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: "Survey" }} />

        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#5bc0de" style={{ flex: 1, justifyContent: "center" }} />
          ) : (


            <FlatList
              data={filteredQuestions} // Combine regular and image-upload questions, with image uploads at the end
              renderItem={({ item }) => {
                if (item.Questiontype === 'Image') {
                  return renderImageUploadQuestions(item); // Render image-upload question
                } else {
                  return renderRegularQuestions(item); // Render regular question
                }
              }}
              keyExtractor={(item) => item.QuestionID.toString()}
              contentContainerStyle={styles.scrollViewContainer}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                <View style={styles.buttonContainer}>

                  {submitting ? (
                    <ActivityIndicator animating={true} size="large" color="#5bc0de" />
                  ) : (
                    <>
                      <Button
                        mode="contained"
                        onPress={() => { setModalVisible(true); }}
                        style={{ backgroundColor: '#92850c' }} // Matching background color and white text
                      >
                        Submitted Survey
                      </Button>


                      <Button mode="contained" onPress={handleSubmitSurvey} style={styles.submitButton} color="#5bc0de">
                        Submit Survey
                      </Button>
                    </>


                  )}
                </View>
              }
            />
          )}

        </View>
        <SubmittedSurvey modalVisible={modalVisible} setModalVisible={setModalVisible} data={completedSurveys} questions={questions} />
      </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 6,
    borderRadius: 8,
    padding: 2,
    elevation: 1,
  },
  question: {
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    marginBottom: 2,
    fontSize: 10,
    height: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    maxHeight: '80%',
  },

  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 14,
    color: '#1a1b24',
  },
  accordionContainer: {
    marginBottom: 2,
  },
  accordionButton: {
    paddingVertical: 4,
  },
  accordionButtonLabel: {
    fontSize: 11,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  imageText: {
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 11,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  uploadButton: {
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
  },

  submitButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
  },
  iconButton: {
    position: 'absolute', // Make sure the icon is absolutely positioned
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'blue',
  },
  iconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerButton: {
    // Example styling for the button
    padding: 10,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  },

  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },

  removeButton: {
    marginTop: 5,
    alignSelf: 'center',
  },

  viewButton: {
    position: 'absolute',
    top: 5,
    right: 50,
    zIndex: 1,
  },

  modalScrollView: {
    alignItems: 'center',
  },

  closeButton: {
    backgroundColor: '#FF6F61',
    marginVertical: 5,
  },
  previewButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  
  fullscreenImage: {
    width: '100%',
    height: '100%',  // 🔄 Fill the modal
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',  // 🔄 Darker overlay for focus
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    width: '89%',        // 🔄 89% Width
    height: '70%',       // 🔄 70% Height
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalImage: {
    width: '100%',
    height: '100%',       // 🔄 Fit image fully inside modal
    borderRadius: 10,
  },
  
  closeIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',  // 🔄 Semi-transparent background
    borderRadius: 20,
  },
  
});


export default QuestionnaireScreen;
