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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const { theme } = useTheme();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');


    const handleCreateAccount = () => {
        if (!phoneNumber.trim()) {
            setError('Please enter your phone number, email, or username');
            return;
        }
        setError('');
        navigation.navigate('EnterPassword', { userInput: phoneNumber });
        // navigation.navigate('HomeScreen', { userInput: phoneNumber });
    };

    const handleSignIn = () => {
        navigation.navigate('Signup');
    };





    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                                  <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
                          
                        </TouchableOpacity> */}
                    </View>

                    {/* Title */}
                    <Text
                        style={[
                            styles.title,
                            {
                                color: theme.colors.text,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.sizes.xxl,
                                fontWeight: theme.typography.weights.bold,
                                marginTop: theme.spacing.xl,
                            },
                        ]}
                    >
                        Sign in to your Account
                    </Text>

                    {/* Input Section */}
                    <View style={styles.inputSection}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.phoneInput,
                                    {
                                        borderColor: error ? 'red' : '#3D4065',
                                        color: '#9E9E9E',
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.sizes.md,
                                    },
                                ]}
                                placeholder="Enter phone or email or username"
                                placeholderTextColor="#9E9E9E"
                                value={phoneNumber}
                                onChangeText={(text) => {
                                    setPhoneNumber(text);
                                    if (error) setError('');
                                }}
                            />
                        </View>

                        {/* Error Message */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomSection}>
                        <TouchableOpacity
                            style={styles.createAccountButton}
                            onPress={handleCreateAccount}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1.5, y: 0.5 }}
                                style={styles.gradientButton}
                            >
                                <Text
                                    style={[
                                        styles.createAccountText,
                                        {
                                            fontFamily: theme.typography.fontFamily,
                                            fontSize: theme.typography.sizes.lg,
                                            fontWeight: theme.typography.weights.medium,
                                        },
                                    ]}
                                >
                                    Next
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Sign Up link */}
                        <View style={styles.signInContainer}>
                            <Text
                                style={[
                                    styles.signInText,
                                    {
                                        color: theme.colors.text,
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.sizes.md,
                                    },
                                ]}
                            >
                                Don’t have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={handleSignIn}>
                                <Text
                                    style={[
                                        styles.signInLink,
                                        {
                                            color: '#007AFF',
                                            fontFamily: theme.typography.fontFamily,
                                            fontSize: theme.typography.sizes.md,
                                            fontWeight: theme.typography.weights.semiBold,
                                        },
                                    ]}
                                >
                                    Sign up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Country Picker */}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: { flex: 1 },
    overlay: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    backIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: { letterSpacing: 0.5 },
    inputSection: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: { paddingBottom: 50 },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    createAccountButton: {
        marginBottom: 16,
        marginTop: 20,
    },
    gradientButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAccountText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: { textAlign: 'center' },
    signInLink: { textAlign: 'center' },
    errorText: {
        color: 'red',
        fontSize: 13,
        // marginTop: 4,
        marginLeft: 8,
    },
});

export default Login;
