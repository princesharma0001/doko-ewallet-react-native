import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    StatusBar,
    Alert,
    Animated,
    Image,
} from 'react-native';
import TouchID from 'react-native-touch-id';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const FaceID = ({ navigation, route }) => {
    const { theme } = useTheme();
    const [isSupported, setIsSupported] = useState(false);
    const [biometryType, setBiometryType] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Check Face ID/Touch ID support
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        try {
            const biometryType = await TouchID.isSupported();
            setIsSupported(true);
            setBiometryType(biometryType);

            // Check if biometric is enrolled
            const enrolled = await TouchID.isDeviceSecure();
            setIsEnrolled(enrolled);
        } catch (error) {
            console.log('Biometric not supported:', error);
            setIsSupported(false);
        }
    };

    const handleEnableFaceID = async () => {
        if (!isSupported) {
            Alert.alert(
                'Not Supported',
                'Face ID/Touch ID is not supported on this device.',
                [{ text: 'OK' }]
            );
            return;
        }

        if (!isEnrolled) {
            Alert.alert(
                'Not Enrolled',
                'Please set up Face ID/Touch ID in your device settings first.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Settings', onPress: () => {
                            // Navigate to device settings
                            Alert.alert('Settings', 'Please go to Settings > Face ID & Passcode to set up Face ID.');
                        }
                    }
                ]
            );
            return;
        }

        setIsProcessing(true);

        try {
            // Authenticate with Face ID/Touch ID
            const result = await TouchID.authenticate(
                `Use ${biometryType} to secure your account`,
                {
                    title: 'Face ID Authentication',
                    subTitle: 'Use your face to unlock the app',
                    description: 'Place your face in front of the camera',
                    fallbackLabel: 'Use Passcode',
                    cancelLabel: 'Cancel',
                }
            );

            if (result) {
                // Face ID setup successful
                Alert.alert(
                    'Face ID Enabled',
                    'Face ID has been successfully enabled for your account!',
                    [
                        {
                            text: 'Continue',
                            onPress: () => navigation.navigate('MainApp', {
                                userData: route.params?.userData,
                                passcode: route.params?.passcode,
                                faceIdEnabled: true,
                                biometryType: biometryType
                            })
                        }
                    ]
                );
            }
        } catch (error) {
            console.log('Face ID authentication failed:', error);

            if (error.code === 'UserCancel') {
                Alert.alert('Cancelled', 'Face ID setup was cancelled.');
            } else if (error.code === 'UserFallback') {
                Alert.alert('Fallback', 'User chose to use passcode instead.');
            } else {
                Alert.alert(
                    'Authentication Failed',
                    'Face ID authentication failed. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSkip = () => {
       Alert.alert(
  'Skip Face ID',
  'Are you sure you want to skip Face ID setup? You can enable it later in settings.',
  [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Skip',
      onPress: () => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
              params: {
                userData: route.params?.userData,
                passcode: route.params?.passcode,
                faceIdEnabled: false,
              },
            },
          ],
        });
      },
    },
  ]
);

    };

    const getBiometricIcon = () => {
        if (biometryType === 'FaceID') {
            return '👤';
        } else if (biometryType === 'TouchID') {
            return '👆';
        } else {
            return '🔐';
        }
    };

    const getBiometricName = () => {
        if (biometryType === 'FaceID') {
            return 'Face ID';
        } else if (biometryType === 'TouchID') {
            return 'Touch ID';
        } else {
            return 'Biometric';
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Header with Back Button */}


                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Biometric Icon */}
                    <View style={styles.iconContainer}>
                        <Image source={require('../assets/Images/Selfies.png')} style={styles.selfieIcon} />

                        {/* <Text style={styles.biometricIcon}>{getBiometricIcon()}</Text> */}
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Enter with Face ID?
                    </Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Would you like to enter the application with Face ID
                        {/* {isSupported && isEnrolled
                            ? `Use ${getBiometricName()} to quickly and securely access your account.`
                            : isSupported
                                ? `Please set up ${getBiometricName()} in your device settings first.`
                                : `${getBiometricName()} is not supported on this device.`
                        } */}
                    </Text>

                    {/* Status Message */}
                    {!isSupported && (
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>
                                Your device doesn't support biometric authentication.
                            </Text>
                        </View>
                    )}

                    {isSupported && !isEnrolled && (
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>
                                Please set up {getBiometricName()} in Settings first.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Enable Button */}
                    <TouchableOpacity
                        style={[
                            styles.enableButton,
                            (!isSupported || !isEnrolled || isProcessing) && styles.disabledButton
                        ]}
                        onPress={handleEnableFaceID}
                        disabled={!isSupported || !isEnrolled || isProcessing}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.enableButtonText}>
                            {isProcessing ? 'Setting up...' : `Enable ${getBiometricName()}`}
                        </Text>
                    </TouchableOpacity>

                    {/* Skip Button */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.skipText,{color:theme.colors.text}]}>Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
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
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        width: 120,
        height: 120,
        // borderRadius: 60,
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    biometricIcon: {
        fontSize: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: '#8C90BF',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    statusContainer: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    selfieIcon: {
        width: width * 0.6,
        height: height * 0.2,
        resizeMode: 'contain',
        // borderRadius: 60,
        // backgroundColor: '#1AA5FF',
        // borderWidth: 3,
        // borderColor: '#0D4F8C',
        alignItems: 'center',
        justifyContent: 'center',
        // shadowColor: '#1AA5FF',
        // shadowOffset: {
        //   width: 0,
        //   height: 4,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 8,
        // elevation: 8,
    },
    statusText: {
        color: '#FFC107',
        fontSize: 14,
        textAlign: 'center',
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    enableButton: {
        backgroundColor: '#1AA5FF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    disabledButton: {
        backgroundColor: '#1AA5FF',

    },
    enableButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipText: {
        color: '#fff',
        fontSize: 16,
        // textDecorationLine: 'underline',
    },
});

export default FaceID;