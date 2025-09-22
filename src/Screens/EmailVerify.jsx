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

const { width, height } = Dimensions.get('window');

const EmailVerify = ({ navigation }) => {
    const { theme } = useTheme();
    const [verificationCode, setVerificationCode] = useState(['', '', '', '',]);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleVerify = () => {
        const code = verificationCode.join('');

        if (code.length !== 4 ) {
            setErrorMessage('Please enter the complete verification code');
            return;
        }

        setIsVerifying(true);

        // Simulate verification
        setTimeout(() => {
            setIsVerifying(false);

            // For demo purposes, accept any 6-digit code
            if (/^\d{4}$/.test(code)) {
                Alert.alert(
                    'Email Verified',
                    'Your email has been verified successfully!',
                    [
                        {
                            text: 'Continue',
                                                         onPress: () => navigation.navigate('CreatePassword'),
                        }
                    ]
                );
            } else {
                setErrorMessage('Invalid verification code. Please try again.');
                setVerificationCode(['', '', '', '', ]);
            }
        }, 2000);
    };

    const handleResendCode = () => {
        setIsResending(true);

        // Simulate resend
        setTimeout(() => {
            setIsResending(false);
            Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
        }, 1500);
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
                            // onPress={handleResendCode}
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
                                Didn't receive the code?
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