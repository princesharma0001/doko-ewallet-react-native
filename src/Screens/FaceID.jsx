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
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const FaceID = ({ navigation, route }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
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
            // Check if ReactNativeBiometrics is available
            if (!ReactNativeBiometrics) {
                console.log('ReactNativeBiometrics is not available');
                setIsSupported(false);
                setIsEnrolled(false);
                return;
            }

            const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
            
            // Check if the instance has the required methods
            if (!rnBiometrics || typeof rnBiometrics.isSensorAvailable !== 'function') {
                console.log('ReactNativeBiometrics instance is not properly initialized');
                setIsSupported(false);
                setIsEnrolled(false);
                return;
            }

            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            
            if (available) {
                setIsSupported(true);
                setBiometryType(biometryType);
                setIsEnrolled(true); // If sensor is available, it means biometric is enrolled
            } else {
                setIsSupported(false);
                setIsEnrolled(false);
            }
        } catch (error) {
            console.log('Biometric not supported:', error);
            setIsSupported(false);
            setIsEnrolled(false);
        }
    };

    const createBiometricKey = async () => {
        try {
            if (!ReactNativeBiometrics) {
                throw new Error('ReactNativeBiometrics is not available');
            }

            const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
            
            if (!rnBiometrics || typeof rnBiometrics.createKeys !== 'function') {
                throw new Error('ReactNativeBiometrics instance is not properly initialized');
            }

            const { publicKey } = await rnBiometrics.createKeys();
            console.log('Biometric key created:', publicKey);
            return publicKey;
        } catch (error) {
            console.log('Error creating biometric key:', error);
            throw error;
        }
    };

    const checkBiometricKeys = async () => {
        try {
            if (!ReactNativeBiometrics) {
                console.log('ReactNativeBiometrics is not available');
                return false;
            }

            const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
            
            if (!rnBiometrics || typeof rnBiometrics.biometricKeysExist !== 'function') {
                console.log('ReactNativeBiometrics instance is not properly initialized');
                return false;
            }

            const { keysExist } = await rnBiometrics.biometricKeysExist();
            return keysExist;
        } catch (error) {
            console.log('Error checking biometric keys:', error);
            return false;
        }
    };

    const handleEnableFaceID = async () => {
        if (!isSupported) {
            Alert.alert(
                t('notSupported'),
                t('faceIdNotSupported'),
                [{ text: t('ok') }]
            );
            return;
        }

        if (!isEnrolled) {
            Alert.alert(
                t('notEnrolled'),
                t('pleaseSetupBiometricFirst'),
                [
                    { text: t('cancel'), style: 'cancel' },
                    {
                        text: t('settings'), onPress: () => {
                            // Navigate to device settings
                            Alert.alert(t('settings'), t('goToSettings'));
                        }
                    }
                ]
            );
            return;
        }

        setIsProcessing(true);

        try {
            // Check if ReactNativeBiometrics is available
            if (!ReactNativeBiometrics) {
                Alert.alert(t('error'), 'Biometric authentication is not available on this device.');
                return;
            }

            // Authenticate with Face ID/Touch ID
            const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
            
            if (!rnBiometrics || typeof rnBiometrics.simplePrompt !== 'function') {
                Alert.alert(t('error'), 'Biometric authentication is not properly initialized.');
                return;
            }

            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: t('faceIdAuthentication'),
                cancelButtonText: t('cancel'),
            });

            if (success) {
                try {
                    // Check if biometric keys already exist
                    const keysExist = await checkBiometricKeys();
                    let publicKey = null;
                    
                    if (!keysExist) {
                        // Create biometric key for secure storage
                        publicKey = await createBiometricKey();
                    } else {
                        console.log('Biometric keys already exist');
                    }
                    
                    // Face ID setup successful
                    Alert.alert(
                        t('faceIdEnabled'),
                        t('faceIdEnabledSuccessfully'),
                        [
                            {
                                text: t('continue'),
                                onPress: () => navigation.navigate('MainApp', {
                                    userData: route.params?.userData,
                                    passcode: route.params?.passcode,
                                    faceIdEnabled: true,
                                    biometryType: biometryType,
                                    biometricPublicKey: publicKey
                                })
                            }
                        ]
                    );
                } catch (keyError) {
                    console.log('Error with biometric keys:', keyError);
                    // Still proceed with Face ID setup even if key creation fails
                    Alert.alert(
                        t('faceIdEnabled'),
                        t('faceIdEnabledSuccessfully'),
                        [
                            {
                                text: t('continue'),
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
            }
        } catch (error) {
            console.log('Face ID authentication failed:', error);

            // Handle different error types
            if (error.message && error.message.includes('UserCancel')) {
                Alert.alert(t('cancelled'), t('faceIdSetupCancelled'));
            } else if (error.message && error.message.includes('UserFallback')) {
                Alert.alert(t('fallback'), t('userChosePasscode'));
            } else {
                Alert.alert(
                    t('authenticationFailed'),
                    t('faceIdAuthenticationFailed'),
                    [{ text: t('ok') }]
                );
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSkip = () => {
       Alert.alert(
  t('skipFaceId'),
  t('skipFaceIdConfirmation'),
  [
    { text: t('cancel'), style: 'cancel' },
    {
      text: t('skip'),
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
        if (biometryType === BiometryTypes.FaceID) {
            return '👤';
        } else if (biometryType === BiometryTypes.TouchID) {
            return '👆';
        } else {
            return '🔐';
        }
    };

    const getBiometricName = () => {
        if (biometryType === BiometryTypes.FaceID) {
            return t('faceId');
        } else if (biometryType === BiometryTypes.TouchID) {
            return t('touchId');
        } else if (biometryType === BiometryTypes.Biometrics) {
            return t('biometric');
        } else {
            return t('biometric');
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
                        {t('enterWithFaceId')}
                    </Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        {t('wouldLikeToEnterWithFaceId')}
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
                                {t('deviceNotSupportBiometric')}
                            </Text>
                        </View>
                    )}

                    {isSupported && !isEnrolled && (
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>
                                {t('pleaseSetupBiometricInSettings').replace('{biometricName}', getBiometricName())}
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
                            {isProcessing ? t('settingUp') : t('enableBiometric').replace('{biometricName}', getBiometricName())}
                        </Text>
                    </TouchableOpacity>

                    {/* Skip Button */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.skipText,{color:theme.colors.text}]}>{t('maybeLater')}</Text>
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