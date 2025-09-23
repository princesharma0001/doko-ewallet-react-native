import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    StatusBar,
    Animated,
    Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ForgotCreatePassword = ({ navigation, route }) => {
    const { theme, isDarkMode } = useTheme();
    const [passcode, setPasscode] = useState('');
    const [confirmPasscode, setConfirmPasscode] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState(null);

    React.useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    React.useEffect(() => {
        // Load token for authenticated request
        const loadToken = async () => {
            try {
                const stored = await AsyncStorage.getItem('dokoToken');
                if (stored) setToken(stored);
            } catch (e) {
                // ignore
            }
        };
        loadToken();
    }, []);

    const handleNumberPress = (number) => {
        if (isConfirming) {
            if (confirmPasscode.length < 4) {
                setConfirmPasscode(prev => prev + number);
            }
        } else {
            if (passcode.length < 4) {
                setPasscode(prev => prev + number);
            }
        }
    };

    const handleBackspace = () => {
        if (isConfirming) {
            setConfirmPasscode(prev => prev.slice(0, -1));
        } else {
            setPasscode(prev => prev.slice(0, -1));
        }
    };

    React.useEffect(() => {
        if (passcode.length === 4 && !isConfirming) {
            // Auto-advance to confirmation after a short delay
            setTimeout(() => {
                setIsConfirming(true);
            }, 500);
        }
    }, [passcode, isConfirming]);

    React.useEffect(() => {
        const submitIfReady = async () => {
            if (confirmPasscode.length === 4) {
                if (passcode !== confirmPasscode) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'The passcodes do not match. Please try again.',
                        position: 'top',
                        visibilityTime: 3000,
                    });
                    setPasscode('');
                    setConfirmPasscode('');
                    setIsConfirming(false);
                    return;
                }

                // Call create passcode API
                try {
                    if (!token) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Authentication token not found. Please try again.',
                            position: 'top',
                            visibilityTime: 4000,
                        });
                        setPasscode('');
                        setConfirmPasscode('');
                        setIsConfirming(false);
                        return;
                    }
                    setIsSubmitting(true);
                    const result = await authService.createPasscode(passcode, confirmPasscode, token);
                    if (result.success) {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Your passcode has been created successfully!',
                            position: 'top',
                            visibilityTime: 3000,
                        });
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: result.error || 'Failed to create passcode. Please try again.',
                            position: 'top',
                            visibilityTime: 4000,
                        });
                        setPasscode('');
                        setConfirmPasscode('');
                        setIsConfirming(false);
                    }
                } catch (err) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'An unexpected error occurred. Please try again.',
                        position: 'top',
                        visibilityTime: 4000,
                    });
                    setPasscode('');
                    setConfirmPasscode('');
                    setIsConfirming(false);
                } finally {
                    setIsSubmitting(false);
                }
            }
        };

        submitIfReady();
    }, [confirmPasscode, passcode, navigation, route.params, setIsConfirming]);

    const renderPasscodeDots = () => {
        const currentPasscode = isConfirming ? confirmPasscode : passcode;
        const dots = [];

        for (let i = 0; i < 4; i++) {
            dots.push(
                <View
                    key={i}
                    style={[
                        styles.passcodeDot,
                        {
                            backgroundColor: i < currentPasscode.length ? theme.colors?.text : 'transparent',
                            borderColor: theme.colors?.text,
                        }
                    ]}
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
            ['', '0', 'backspace']
        ];

        return numbers.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
                {row.map((item, colIndex) => (
                    <TouchableOpacity
                        key={`${rowIndex}-${colIndex}`}
                        style={[styles.keypadButton, { backgroundColor: isDarkMode ? '#2C2E41' : "lightgray", opacity: isSubmitting ? 0.7 : 1 }]}
                        onPress={() => {
                            if (isSubmitting) return;
                            if (item === 'backspace') {
                                handleBackspace();
                            } else if (item !== '') {
                                handleNumberPress(item);
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        {item === 'backspace' ? (
                            <Text style={styles.backspaceIcon}>⌫</Text>
                        ) : item !== '' ? (
                            <Text style={styles.keypadNumber}>{item}</Text>
                        ) : null}
                    </TouchableOpacity>
                ))}
            </View>
        ));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Title */}
                <Text style={[styles.title, { color: theme.colors?.text }]}>
                    {isConfirming ? 'Confirm Passcode' : 'Create Passcode'}
                </Text>

                {/* Passcode Dots */}
                <View style={styles.passcodeContainer}>
                    {renderPasscodeDots()}
                </View>

                {/* Keypad */}
                <View style={styles.keypadContainer}>
                    {renderKeypad()}
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 60,
        textAlign: 'center',
        letterSpacing: 0.5,
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
    },
    keypadContainer: {
        width: width * 0.8,
        maxWidth: 300,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    keypadButton: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#2C2E41',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    keypadNumber: {
        fontSize: 32,
        fontWeight: '300',
        color: '#FFFFFF',
    },
    backspaceIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default ForgotCreatePassword;
