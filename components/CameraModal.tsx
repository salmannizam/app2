import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// Import vector icons from expo
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

interface CameraModalProps {
  visible: boolean;
  questionId: any;
  onClose: () => void;
  onImageCaptured: (questionId: number, uri: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  questionId,
  onClose,
  onImageCaptured,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  const toggleCameraType = () => {
    setCameraType((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        exif: true,
        skipProcessing: true,
      });

      const processedImage = await processImage(photo.uri);
      onImageCaptured(questionId, processedImage);
      onClose();
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (uri: string): Promise<string> => {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists || !info.size) throw new Error('Image file not found');

    let currentUri = uri;
    let fileSizeInKB = info.size / 1024;
    let quality = 70;
    let iteration = 0;
    const maxIterations = 5;
    const targetSizeKB = 100;

    while (fileSizeInKB > targetSizeKB && quality > 10 && iteration < maxIterations) {
      const result = await ImageManipulator.manipulateAsync(
        currentUri,
        [{ resize: { width: 1024 } }],
        { compress: quality / 100, format: ImageManipulator.SaveFormat.JPEG }
      );

      const newInfo = await FileSystem.getInfoAsync(result.uri);
      if (!newInfo.exists || !newInfo.size) throw new Error('Compression failed');

      if (currentUri !== uri) {
        await FileSystem.deleteAsync(currentUri).catch(() => {});
      }

      currentUri = result.uri;
      fileSizeInKB = newInfo.size / 1024;
      quality -= 15;
      iteration++;
    }

    return currentUri;
  };

  if (!permission) {
    return (
      <Modal visible={visible} transparent={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent={false}>
        <View style={styles.permissionDeniedContainer}>
          <Text>No access to camera</Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text style={styles.text}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {visible && (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={cameraType}
          >
           <View style={styles.buttonContainer}>
  {/* Flip Camera Button with icon */}
  <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
    <MaterialIcons name="flip-camera-ios" size={30} color="white" />
  </TouchableOpacity>

  {/* Capture Button with camera icon */}
  <TouchableOpacity
    style={styles.captureButton}
    onPress={handleTakePicture}
    disabled={isProcessing}
  >
    {isProcessing ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Ionicons name="camera" size={40} color="white" />
    )}
  </TouchableOpacity>

  {/* Close Button (text) */}
  <TouchableOpacity style={styles.textButton} onPress={onClose}>
    <Text style={styles.text}>Close</Text>
  </TouchableOpacity>
</View>

          </CameraView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',  // evenly distribute buttons
    alignItems: 'center',             // vertically center
    paddingHorizontal: 20,
    paddingBottom: 30,                // bottom padding for better spacing
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  
  captureButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    // remove marginBottom for vertical alignment
  },
  textButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraModal;
