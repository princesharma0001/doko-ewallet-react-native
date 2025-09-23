import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import TouchID from 'react-native-touch-id';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/apiService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../store';

const { width, height } = Dimensions.get('window');

const EnterPassword = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const [passcode, setPasscode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  console.log("Sdfsdgfsda", currentUser);

  const isLoginInProgress = useRef(false);

  const handleNumberPress = (number) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleFaceID = async () => {
    try {
      setIsProcessing(true);

      // Check if Face ID is supported
      const biometryType = await TouchID.isSupported();

      if (biometryType) {
        // Authenticate with Face ID
        const result = await TouchID.authenticate(
          'Use Face ID to unlock',
          {
            title: 'Face ID Authentication',
            subTitle: 'Use your face to unlock the app',
            description: 'Place your face in front of the camera',
            fallbackLabel: 'Use Passcode',
            cancelLabel: 'Cancel',
          }
        );

        if (result) {
          // Face ID authentication successful
          navigation.navigate('HomeScreen', {
            userData: route.params?.userData,
            loginMethod: 'faceid'
          });
        }
      }
    } catch (error) {
      console.log('Face ID authentication failed:', error);
      if (error.code !== 'UserCancel') {
        Alert.alert(
          'Authentication Failed',
          'Face ID authentication failed. Please try again or use passcode.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotPasscode = async () => {
    Alert.alert(
      'Forgot Passcode?',
      'We will send you a verification code to reset your passcode.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Code',
          style: 'default',
          onPress: async () => {
            try {
              const identity = route.params?.identity || currentUser?.email || currentUser?.phone;

              if (!identity) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Identity not found. Please try again.',
                  position: 'top',
                  visibilityTime: 3000,
                });
                return;
              }

              setIsProcessing(true);

              const result = await authService.forgotPasscode(identity);
              console.log("sdagahandleSubmitsdgsa", result);

              if (result.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Code Sent',
                  text2: 'Verification code sent successfully',
                  position: 'top',
                  visibilityTime: 2000,
                });

                // Navigate to ForgotVerify screen
                navigation.navigate('ForgotVerify', {
                  identity: identity,
                  // userData: currentUser
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Failed',
                  text2: result.error || 'Failed to send verification code',
                  position: 'top',
                  visibilityTime: 3000,
                });
              }
            } catch (error) {
              console.error('Forgot passcode error:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred',
                position: 'top',
                visibilityTime: 3000,
              });
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const renderPasscodeDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.passcodeDot,
            {
              backgroundColor: i < passcode.length ? theme.colors?.text : 'transparent',
              borderColor: theme.colors?.text,
            }
          ]}
        // style={[
        //   styles.passcodeDot,
        //   i < passcode.length && styles.passcodeDotFilled
        // ]}
        />
      );
    }
    return dots;
  };

  const renderKeypad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['faceid', '0', 'backspace']
    ];

    return numbers.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.keypadRow}>
        {row.map((item, colIndex) => (
          <TouchableOpacity
            key={`${rowIndex}-${colIndex}`}
            style={[styles.keypadButton, { backgroundColor: isDarkMode ? '#2C2E41' : "lightgray" }]}
            onPress={() => {
              if (item === 'backspace') {
                handleBackspace();
              } else if (item === 'faceid') {
                handleFaceID();
              } else if (item !== '') {
                handleNumberPress(item);
              }
            }}
            activeOpacity={0.7}
          >
            {item === 'backspace' ? (
              <Text style={styles.backspaceIcon}>⌫</Text>
            ) : item === 'faceid' ? (
              <View style={styles.faceIdIcon}>
                <Image source={require("../assets/Images/FACES.png")} resizeMode='contain' />
              </View>
            ) : item !== '' ? (
              <Text style={styles.keypadNumber}>{item}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  // Auto-submit when passcode is complete
  React.useEffect(() => {
    const tryLogin = async () => {
      if (passcode.length === 4 && !isProcessing && !isLoginInProgress.current) {
        isLoginInProgress.current = true;
        setIsProcessing(true);
        try {
          const identity = route.params?.identity; // from Login screen (email/phone/username)
          if (!identity) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Identity not found. Please go back and enter your email/phone/username.',
              position: 'top',
              visibilityTime: 4000,
            });
            setPasscode('');
            return;
          }

          const result = await authService.login(identity, passcode);
          console.log("Sdgasdgsadgs", result);

          if (result.success) {
            console.log("fdgdsfgs", result?.success);

            // Store token from API response
            if (result.data?.token) {
              await AsyncStorage.setItem('dokoToken', result.data.token);
            }
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Logged in successfully!',
              position: 'top',
              visibilityTime: 2000,
            });
            navigation.navigate('HomeScreen', {
              userData: result.data,
              loginMethod: 'passcode',
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Login failed',
              text2: result.error || 'Invalid credentials. Please try again.',
              position: 'top',
              visibilityTime: 4000,
            });
            setPasscode('');
          }
        } catch (e) {
          console.log("Sdgasdgasdg", e);

          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An unexpected error occurred. Please try again.',
            position: 'top',
            visibilityTime: 4000,
          });
          setPasscode('');
        } finally {
          setIsProcessing(false);
          isLoginInProgress.current = false;
        }
      }
    };
    tryLogin();
  }, [passcode, navigation, route.params]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Welcome Back {currentUser?.firstName ?? route.params?.userData?.firstName ?? "User"}!
          </Text>

          <Text style={[styles.title, { color: theme.colors.text }]}>Enter Passcode</Text>
        </View>

        {/* Passcode Dots */}
        <View style={styles.passcodeContainer}>
          {renderPasscodeDots()}
        </View>

        {/* Keypad */}
        <View style={styles.keypadContainer}>
          {renderKeypad()}
        </View>

        {/* Forgot Passcode Link */}
        <TouchableOpacity
          style={styles.forgotPasscodeButton}
          onPress={handleForgotPasscode}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasscodeText}>Forgot your passcode?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingTop: 110,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    gap: 20,
  },
  passcodeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  passcodeDotFilled: {
    backgroundColor: '#FFFFFF',
  },
  keypadContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    backgroundColor: '#2C2E41',
    alignItems: 'center',
  },
  keypadNumber: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  backspaceIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  faceIdIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceIdText: {
    fontSize: 20,
  },
  forgotPasscodeButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  forgotPasscodeText: {
    color: '#169BFF',
    fontSize: 16,
    // textDecorationLine: 'underline',
  },
});

export default EnterPassword;
