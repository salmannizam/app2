import React, { useEffect, useState } from 'react';
import { Button, RadioButton } from 'react-native-paper';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
interface ContinueSurveyModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (value: 'yes' | 'no') => void;
    onYesNoChange: (value: 'yes' | 'no') => void;
    totalSubmitted: number;
    continuesurveyModalLoader: boolean;
}

const ContinueSurveyModal: React.FC<ContinueSurveyModalProps> = ({
    visible,
    onClose,
    onSubmit,
    onYesNoChange,
    totalSubmitted,
    continuesurveyModalLoader
}) => {
    const [selected, setSelected] = useState<'yes' | 'no'>('yes'); // default to 'yes'

    useEffect(() => {
        if (visible) {
            setSelected('yes');
            onYesNoChange('yes');
        }
    }, [visible]);

    const handleChange = (value: string) => {
        if (value === 'yes' || value === 'no') {
            setSelected(value);
            onYesNoChange(value);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    width: '80%',
                    position: 'relative'
                }}>
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 1
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>✕</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
                        Do you want to continue more survey?
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
                        Total Product Submitted :{totalSubmitted}
                    </Text>
                    <RadioButton.Group onValueChange={handleChange} value={selected}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                            <RadioButton.Item value="yes" label="Yes" />
                            <RadioButton.Item label="No" value="no" />
                        </View>
                    </RadioButton.Group>

                    {continuesurveyModalLoader ? <ActivityIndicator animating={true} size="large" color="#5bc0de" /> : <Button mode="contained" onPress={() => onSubmit(selected)}>
                        Proceed
                    </Button>

                    }

                </View>
            </View>
        </Modal>
    );
};

export default ContinueSurveyModal;
