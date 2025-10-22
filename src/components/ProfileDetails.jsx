import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../store';
import { authService } from '../services/apiService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getProfile } from '../store/slices/userSlice';

const { width, height } = Dimensions.get('window');

const ProfileDetails = ({ navigation }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { currentUser, isProfileLoading, profileError } = useAppSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    // Get token from AsyncStorage on component mount
    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('dokoToken');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error retrieving token:', error);
            }
        };
        getToken();
    }, []);

    const [formData, setFormData] = useState({
        name: currentUser?.firstName ?? '',
        lastName: currentUser?.lastName ?? "",
        username: currentUser?.username ?? '',
        email1: currentUser?.email ?? '',
        dateOfBirth: currentUser?.dateOfBirth ?? '',
        address: currentUser?.address?.formattedAddress ?? '',
        phoneNumber: currentUser?.phone ?? '',
        // email2: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 10;
    };

    const validateDate = (date) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = t('nameRequired');
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t('nameMinLength');
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = t('lastNameRequired');
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = t('lastNameMinLength');
        }

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = t('usernameRequired');
        } else if (!validateUsername(formData.username)) {
            newErrors.username = t('usernameInvalid');
        }

        // Email 1 validation
        if (!formData.email1.trim()) {
            newErrors.email1 = t('emailRequired');
        } else if (!validateEmail(formData.email1)) {
            newErrors.email1 = t('emailInvalid');
        }

        // Date of Birth validation
        if (!formData.dateOfBirth.trim()) {
            newErrors.dateOfBirth = t('dateOfBirthRequired');
        } else if (!validateDate(formData.dateOfBirth)) {
            newErrors.dateOfBirth = t('dateOfBirthInvalid');
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = t('addressRequired');
        } else if (formData.address.trim().length < 5) {
            newErrors.address = t('addressMinLength');
        }

        // Phone Number validation
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t('phoneNumberRequired');
        } else if (!validatePhone(formData.phoneNumber)) {
            newErrors.phoneNumber = t('phoneNumberInvalid');
        }

        // Email 2 validation
        // if (!formData.email2.trim()) {
        //     newErrors.email2 = 'Email is required';
        // } else if (!validateEmail(formData.email2)) {
        //     newErrors.email2 = 'Please enter a valid email address';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                // Check if token is available
                if (!token) {
                    Toast.show({
                        type: 'error',
                        text1: t('error'),
                        text2: t('authenticationTokenNotFound'),
                        position: 'top',
                        visibilityTime: 4000,
                    });
                    setIsSubmitting(false);
                    return;
                }

                const profileData = {
                    username: formData?.username.trim(),
                    firstName: formData.name.trim(),
                    lastName: formData?.lastName.trim(),
                    email: formData.email1.trim(),
                    phone: formData.phoneNumber.trim(),
                    countryCode: currentUser?.countryCode || '+1', // Use existing or default
                    dateOfBirth: formData.dateOfBirth.trim(), // Already in YYYY-MM-DD format
                    address: {
                        street: formData.address.trim(),
                        city: '', // Not collected separately
                        state: '', // Empty for now
                        country: currentUser?.address?.country || 'Unknown',
                        zipCode: '', // Empty for now
                        formattedAddress: formData.address.trim()
                    },
                };

                console.log('Updating profile with data:', profileData);
                const updateResult = await authService.updateProfile(profileData, token);

                if (updateResult.success) {
                    console.log('Profile updated successfully:', updateResult.data);
                    dispatch(getProfile());
                    Toast.show({
                        type: 'success',
                        text1: t('success'),
                        text2: t('profileUpdatedSuccessfully'),
                        position: 'top',
                        visibilityTime: 3000,
                    });
                    navigation.goBack();




                } else {

                    Toast.show({
                        type: 'error',
                        text1: t('error'),
                        text2: updateResult.error || t('failedToUpdateProfile'),
                        position: 'top',
                        visibilityTime: 4000,
                    });
                }
            } catch (error) {
                console.error('Unexpected error during profile update:', error);

                Toast.show({
                    type: 'error',
                    text1: t('error'),
                    text2: t('unexpectedErrorOccurred'),
                    position: 'top',
                    visibilityTime: 4000,
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <View style={styles.headerContent}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation?.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

            </View>
        </View>
    );

    const renderInputField = (field, placeholder, keyboardType = 'default') => (
        <View style={styles.fieldContainer}>
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: errors[field] ? theme.colors.error : theme.colors.border
                }
            ]}>
                <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    value={formData[field]}
                    onChangeText={(value) => handleInputChange(field, value)}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType={keyboardType}
                    editable={true}
                />
            </View>
            {errors[field] && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors[field]}
                </Text>
            )}
        </View>
    );

    const renderForm = () => (
        <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('personalDetails')}</Text>
            </View>
            {renderInputField('name', t('name'))}
            {renderInputField('lastName', t('lastName'))}

            {renderInputField('username', t('username'))}
            {renderInputField('email1', t('email'))}
            {renderInputField('dateOfBirth', t('dateOfBirth'))}
            {renderInputField('address', t('address'))}
            {renderInputField('phoneNumber', t('phoneNumber'), 'phone-pad')}
            {/* {renderInputField('email2', 'Email')} */}
        </View>
    );

    const renderInfoMessage = () => (
        <View style={styles.messageContainer}>
            <Text style={[styles.messageText, { color: theme.colors.textSecondary }]}>
                {t('yourInformationSaved')}
            </Text>
        </View>
    );

    const renderSubmitButton = () => (
        <TouchableOpacity
            style={styles.createAccountButton}
            disabled={isSubmitting}
            onPress={handleSubmit}
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
                    {isSubmitting ? t('submitting') : t('saveDetails')}
                </Text>
            </LinearGradient>
        </TouchableOpacity>

    );

    const renderContactSupport = () => (
        <TouchableOpacity style={styles.contactSupportButton}>
            <Text style={[styles.contactSupportText, { color: theme.colors.text }]}>{t('contactSupport')}</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            {renderHeader()}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.content}>
                    {renderForm()}
                    {renderSubmitButton()}
                    {renderInfoMessage()}
                    {renderContactSupport()}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        // paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '700',
    },
    headerSpacer: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        flex: 1,
    },
    formContainer: {
        marginBottom: 30,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    inputContainer: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    input: {
        fontSize: 16,
        paddingVertical: 10,
        fontFamily: 'System',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    submitButton: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    messageContainer: {
        marginBottom: 15,
        paddingHorizontal: 4,
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
    messageText: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center',
    },
    contactSupportButton: {
        alignItems: 'center',
        paddingBottom: 16,
    },
    contactSupportText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileDetails;
