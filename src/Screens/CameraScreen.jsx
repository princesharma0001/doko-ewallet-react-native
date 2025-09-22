import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CameraScreen = ({ navigation, route }) => {
  const { userData } = route.params || {};
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Request camera permission
    requestCameraPermission();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission !== 'authorized') {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to take a selfie.',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Settings', onPress: () => Camera.requestCameraPermission() }
        ]
      );
    }
  };

  const takePhoto = async () => {
    if (camera.current && !isCapturing) {
      setIsCapturing(true);
      
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: flashMode,
        });
        
        // Simulate processing
        setTimeout(() => {
          setIsCapturing(false);
          Alert.alert(
            'Photo Captured',
            'Your selfie has been captured successfully!',
            [
              {
                text: 'Continue',
                onPress: () => navigation.navigate('EmailVerify', { 
                  userData,
                  selfiePhoto: photo.path 
                })
              }
            ]
          );
        }, 1500);
      } catch (error) {
        setIsCapturing(false);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'on' : 'off');
  };

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Camera View */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        enableZoomGesture={true}
      />

      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Take a quick photo</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => Alert.alert('Help', 'Position your face within the oval and tap the capture button.')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>?</Text>
          </TouchableOpacity>
        </View>

        {/* Face Guide */}
        <View style={styles.faceGuideContainer}>
          <View style={styles.faceGuide}>
            {/* Oval outline for face positioning */}
            <View style={styles.faceOval} />
          </View>
          
          {/* Instruction text */}
          <View style={styles.instructionContainer}>
            <View style={styles.instructionLine} />
            <Text style={styles.instructionText}>Hold still</Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Flash Toggle */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}
            activeOpacity={0.7}
          >
            <Text style={styles.controlButtonText}>
              {flashMode === 'off' ? '⚡' : '⚡️'}
            </Text>
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonActive]}
            onPress={takePhoto}
            disabled={isCapturing}
            activeOpacity={0.8}
          >
            <View style={styles.captureButtonInner}>
              {isCapturing && <View style={styles.captureButtonPulse} />}
            </View>
          </TouchableOpacity>

          {/* Gallery/Photos Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => Alert.alert('Gallery', 'Gallery feature coming soon!')}
            activeOpacity={0.7}
          >
            <Text style={styles.controlButtonText}>🖼️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  faceGuideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: width * 0.7,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOval: {
    width: width * 0.6,
    height: height * 0.35,
    borderRadius: width * 0.3,
    borderWidth: 3,
    borderColor: '#1AA5FF',
    backgroundColor: 'transparent',
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  instructionLine: {
    width: 60,
    height: 2,
    backgroundColor: '#1AA5FF',
    marginBottom: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonActive: {
    backgroundColor: '#1AA5FF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonPulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1AA5FF',
  },
});

export default CameraScreen;
