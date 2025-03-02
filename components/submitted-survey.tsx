import React, { useState, useEffect } from "react";
import { View, Text, Modal, ScrollView, ActivityIndicator } from "react-native";
import { Button, List } from "react-native-paper";

// Define the TypeScript interface for a survey item (adjust as needed)
interface SurveyItem {
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

interface SubmittedSurveyProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  data: SurveyItem[];
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

const SubmittedSurvey: React.FC<SubmittedSurveyProps> = ({ modalVisible, setModalVisible, data }) => {
  // Use the SubResultID as the key for expanded accordion
  const [expandedSubResultID, setExpandedSubResultID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedSurveys, setGroupedSurveys] = useState<{ [key: string]: SurveyItem[] }>({});

  useEffect(() => {
    if (modalVisible) {
      setLoading(true);
      // In a real scenario, you might call an API here.
      // Since data comes via props, we group it immediately.
      if (data && data.length > 0) {
        const grouped = groupDataBySubResultID(data);
        setGroupedSurveys(grouped);
      }
      setLoading(false);
    }
  }, [modalVisible, data]);

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
                    title={`SubResultID: ${subResultID}`}
                    expanded={expandedSubResultID === subResultID}
                    onPress={() =>
                      setExpandedSubResultID(expandedSubResultID === subResultID ? null : subResultID)
                    }
                    titleStyle={{ fontWeight: 'bold', fontSize: 14 }}
                    style={{ backgroundColor: '#f4f4f4', marginBottom: 5 }}
                  >
                    <View style={{ paddingHorizontal: 10, backgroundColor: '#fff', borderRadius: 5 }}>
                      <View style={{ flexDirection: 'row', padding: 8, borderRadius: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, width: '30%', textAlign: 'center' }}>
                          Question ID
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, width: '40%', textAlign: 'center' }}>
                          Answer
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, width: '30%', textAlign: 'center' }}>
                          Answer ID
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
                          <Text style={{ fontSize: 12, width: '30%', textAlign: 'center' }}>
                            {item.QuestionID}
                          </Text>
                          <Text style={{ fontSize: 12, width: '40%', textAlign: 'center' }}>
                            {item.AnswerText}
                          </Text>
                          <Text style={{ fontSize: 12, width: '30%', textAlign: 'center' }}>
                            {item.AnswerID}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </List.Accordion>
                ))
              ) : (
                <Text style={{ textAlign: 'center', padding: 10 }}>No surveys available.</Text>
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
