import React, { useState, useEffect } from "react";
import { View, Text, Modal, ScrollView, ActivityIndicator } from "react-native";
import { Button, List } from "react-native-paper";

// Define the TypeScript interface for a survey item (adjust as needed)
interface SurveyItem {
  Question: string;
  AnswerID: string;
  AnswerText: string;
  DeviceID: string;
  Location: string;
  ProjectId: string;
  QuestionID: number;
  Remarks: string;
  ResultID: string;
  SubResultID: string;
  SurveyID: string;
}


interface QuestionItem {
  QuestionID: number;
  Question: string;
}

interface SubmittedSurveyProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  data: SurveyItem[];
  questions: QuestionItem[];
}


// Helper function to group data by SubResultID
const groupDataBySubResultID = (data: SurveyItem[]) => {
  return data.reduce((acc: { [key: string]: SurveyItem[] }, item) => {
    if (!acc[item.SubResultID]) {
      acc[item.SubResultID] = [];
    }
    acc[item.SubResultID].push(item);
    return acc;
  }, {});
};

const SubmittedSurvey: React.FC<SubmittedSurveyProps> = ({ modalVisible, setModalVisible, data, questions }) => {
  // Use the SubResultID as the key for expanded accordion
  const [expandedSubResultID, setExpandedSubResultID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedSurveys, setGroupedSurveys] = useState<{ [key: string]: SurveyItem[] }>({});

  useEffect(() => {
    if (modalVisible) {
      setLoading(true);
      // In a real scenario, you might call an API here.
      // Since data comes via props, we group it immediately.
      if (data && data.length > 0 && data[0].SubResultID) {
        const updatedData = data.map((item) => ({
          ...item,
          Question: getQuestionName(item.QuestionID),  // Add question name
        }));

        const grouped = groupDataBySubResultID(updatedData);
        setGroupedSurveys(grouped);
      }
      setLoading(false);
    }
  }, [modalVisible, data, questions]);

  // Helper function to get question name using QuestionID
  const getQuestionName = (questionID: number) => {
    const questionItem = questions.find((q) => q.QuestionID === questionID);
    return questionItem?.Question || "Unknown Question";
  };


  // Extract AnswerText for QuestionID 10006
  const getAccordionHeader = (surveyItems: SurveyItem[]) => {
    const headerItem = surveyItems.find((item) => item.QuestionID === 10000038);
    return headerItem?.AnswerText || 'Survey Details';
  };


  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: '90%',
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            maxHeight: '80%'
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
            Submitted Surveys
          </Text>

          {loading ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="large" color="#5bc0de" />
              <Text style={{ marginTop: 10 }}>Loading surveys...</Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              {Object.keys(groupedSurveys).length > 0 ? (
                Object.entries(groupedSurveys).map(([subResultID, surveyItems]) => (
                  <List.Accordion
                    key={subResultID}
                    title={getAccordionHeader(surveyItems)}
                    expanded={expandedSubResultID === subResultID}
                    onPress={() =>
                      setExpandedSubResultID(expandedSubResultID === subResultID ? null : subResultID)
                    }
                    titleStyle={{ fontWeight: 'bold', fontSize: 14 }}
                    style={{ backgroundColor: '#f4f4f4', marginBottom: 5 }}
                  >
                    <View style={{ paddingHorizontal: 10, backgroundColor: '#fff', borderRadius: 5 }}>
                      <View style={{ flexDirection: 'row', padding: 8, borderRadius: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, width: '70%', textAlign: 'center' }}>
                          Question
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, width: '30%', textAlign: 'center' }}>
                          Answer
                        </Text>
                      </View>

                      {surveyItems.map((item, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 6,
                            borderBottomWidth: idx !== surveyItems.length - 1 ? 1 : 0,
                            borderBottomColor: '#ddd',
                          }}
                        >
                          <Text style={{ fontSize: 12, width: '70%', textAlign: 'center' }}>
                            {item.Question}
                          </Text>
                          <Text style={{ fontSize: 12, width: '30%', textAlign: 'center' }}>
                            {item.AnswerText}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </List.Accordion>
                ))
              ) : (
                <Text style={{ textAlign: 'center', padding: 10 }}>No surveys submitted.</Text>
              )}
            </ScrollView>
          )}

          {/* Close Button */}
          <Button
            mode="contained"
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 10, backgroundColor: '#FF6F61' }}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default SubmittedSurvey;
