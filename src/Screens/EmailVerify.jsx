import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { authService } from '../services/apiService';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const EmailVerify = ({ navigation, route }) => {
    const { theme } = useTheme();
    const [verificationCode, setVerificationCode] = useState(['', '', '', '',]);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { userData } = route.params || {};
    const email = userData?.email;

    const handleCodeChange = (value, index) => {
        // Clear error when user starts typing
        if (errorMessage) {
            setErrorMessage('');
        }

        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Update verification code array
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus next input if value is entered
        if (value && index < 3) {
            // Focus next input
            const nextInput = `input_${index + 1}`;
            // You can use refs here if needed
        }
    };

    const handleVerify = async () => {
        const code = verificationCode.join('');

        if (code.length !== 4) {
            setErrorMessage('Please enter the complete verification code');
            return;
        }

        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Email not found. Please go back and try again.',
                position: 'top',
                visibilityTime: 4000,
            });
            return;
        }

        setIsVerifying(true);
        setErrorMessage('');

        try {
            const result = await authService.verifyOTP(email, code);
            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Email verified successfully!',
                    position: 'top',
                    visibilityTime: 3000,
                });
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'CreatePassword' }],
                    })
                );
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: result.error || 'Invalid OTP. Please try again.',
                    position: 'top',
                    visibilityTime: 4000,
                });
                setVerificationCode(['', '', '', '',]);
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred. Please try again.',
                position: 'top',
                visibilityTime: 4000,
            });
            setVerificationCode(['', '', '', '',]);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Email not found. Please go back and try again.',
                position: 'top',
                visibilityTime: 4000,
            });
            return;
        }

        setIsResending(true);
        try {
            const result = await authService.resendOTP(email);
            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'OTP has been sent Successfully.',
                    position: 'top',
                    visibilityTime: 3000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: result.error || 'Failed to resend code. Please try again.',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred. Please try again.',
                position: 'top',
                visibilityTime: 4000,
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Dark overlay for better text readability */}
                <View style={styles.overlay}>
                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <AntDesign name="arrowleft" size={24} color={theme.colors.text} />

                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content Container */}
                    <ScrollView
                        style={styles.scrollableContent}
                        contentContainerStyle={styles.scrollContentContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Main Content */}
                        <View style={styles.content}>
                            {/* Title */}
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color: theme.colors.text,
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.sizes.xxl,
                                        fontWeight: theme.typography.weights.bold,
                                    },
                                ]}
                            >
                                Verify your email
                            </Text>

                            {/* Description */}
                            <Text
                                style={[
                                    styles.description,
                                    {
                                        color: '#8C90BF',
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.sizes.md,
                                        fontWeight: theme.typography.weights.regular,
                                    },
                                ]}
                            >
                                We've sent a 6-digit verification code to your email address. Please enter it below.
                            </Text>

                            {/* Verification Code Inputs */}
                            <View style={styles.codeContainer}>
                                {verificationCode.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={[
                                            styles.codeInput,
                                            {
                                                borderColor: errorMessage ? '#FF3B30' : '#3D4065',
                                                color: errorMessage ? '#FF3B30' : theme.colors.text,
                                            },
                                        ]}
                                        value={digit}
                                        onChangeText={(value) => handleCodeChange(value, index)}
                                        placeholder="0"
                                        placeholderTextColor="#8C90BF"
                                        keyboardType="numeric"
                                        maxLength={1}
                                        textAlign="center"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            {/* Error Message */}
                            {errorMessage && (
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            )}



                        </View>
                    </ScrollView>

                    {/* Fixed Bottom Section */}
                    <View style={styles.bottomSection}>
                        <TouchableOpacity
                            style={styles.resendContainer}
                            onPress={isResending ? undefined : handleResendCode}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.resendText,
                                    {
                                        color: '#169BFF',
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.sizes.md,
                                        fontWeight: theme.typography.weights.medium,
                                    },
                                ]}
                            >
                                {isResending ? 'Resending...' : "Didn't receive the code?"}
                            </Text>
                        </TouchableOpacity>
                        {/* Verify Button */}
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={handleVerify}
                            activeOpacity={0.8}
                            disabled={isVerifying}
                        >
                            <LinearGradient
                                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1.5, y: 0.5 }}
                                style={styles.gradientButton}
                            >
                                <Text
                                    style={[
                                        styles.verifyText,
                                        {
                                            fontFamily: theme.typography.fontFamily,
                                            fontSize: theme.typography.sizes.lg,
                                            fontWeight: theme.typography.weights.medium,
                                        },
                                    ]}
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify Email'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingTop: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        zIndex: 10,
    },
    scrollableContent: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
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
    content: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    description: {
        marginBottom: 40,
        lineHeight: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    codeInput: {
        flex: 1,
        height: 60,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 24,
        fontFamily: 'System',
        fontWeight: '600',
    },
    resendContainer: {
        marginBottom: 20,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    resendButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    resendText: {
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 15,
        paddingTop: 16,
    },
    verifyButton: {
        marginBottom: 16,
    },
    gradientButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default EmailVerify;