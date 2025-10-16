import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation files
const translations = {
  en: {
    // Settings
    settings: 'Settings',
    search: 'Search',
    display: 'Display',
    language: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    english: 'English',
    nepali: 'नेपाली',
    apply: 'Apply',
    
    // Login
    signInToAccount: 'Sign in to your Account',
    enterPhoneEmailUsername: 'Enter phone or email or username',
    next: 'Next',
    checking: 'Checking...',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    pleaseEnterPhoneNumber: 'Please enter your phone number, email, or username',
    error: 'Error',
    userNotFound: 'User not found.',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    
    // EnterPassword
    welcomeBack: 'Welcome Back',
    user: 'User',
    enterPasscode: 'Enter Passcode',
    forgotPasscode: 'Forgot your passcode?',
    useFaceIdToUnlock: 'Use Face ID to unlock',
    faceIdAuthentication: 'Face ID Authentication',
    useFaceToUnlock: 'Use your face to unlock the app',
    placeFaceInCamera: 'Place your face in front of the camera',
    usePasscode: 'Use Passcode',
    cancel: 'Cancel',
    authenticationFailed: 'Authentication Failed',
    faceIdFailed: 'Face ID authentication failed. Please try again or use passcode.',
    ok: 'OK',
    forgotPasscodeTitle: 'Forgot Passcode?',
    sendVerificationCode: 'We will send you a verification code to reset your passcode.',
    sendCode: 'Send Code',
    identityNotFound: 'Identity not found. Please try again.',
    codeSent: 'Code Sent',
    verificationCodeSent: 'Verification code sent successfully',
    failed: 'Failed',
    failedToSendCode: 'Failed to send verification code',
    success: 'Success',
    loggedInSuccessfully: 'Logged in successfully!',
    loginFailed: 'Login failed',
    invalidCredentials: 'Invalid credentials. Please try again.',
    identityNotFoundGoBack: 'Identity not found. Please go back and enter your email/phone/username.',
    
    // Signup
    letsGetStarted: "Let's Get Started!",
    enterYourPhoneNumber: 'Enter your phone number',
    createAccount: 'Create Account',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    pleaseEnterPhoneNumber: 'Please enter your phone number',
    pleaseEnterValidPhoneNumber: 'Please enter a valid phone number',
    accountCreatedSuccessfully: 'Account created successfully!',
    otpSentToPhone: 'OTP has been sent to your phone.',
    failedToCreateAccount: 'Failed to create account. Please try again.',
    
    // CountryPicker
    selectCountry: 'Select Country',
    search: 'Search',
    
    // PhoneVerify
    phoneVerification: 'Phone Verification',
    enterVerificationCode: 'Please enter 4-digit verification code sent to',
    didntReceiveCode: "Didn't receive the code?",
    submit: 'Submit',
    verifying: 'Verifying...',
    pleaseEnterOtp: 'Please enter OTP',
    userIdentityNotFound: 'User identity not found. Please try signing up again.',
    phoneNumberVerified: 'Phone number verified successfully!',
    invalidOtp: 'Invalid OTP. Please try again.',
    otpSentSuccessfully: 'OTP has been sent Successfully.',
    failedToResendCode: 'Failed to resend code. Please try again.',
    
    // EnterNameSign
    personalInformation: 'Personal Information',
    providePersonalDetails: 'Please provide your personal details and address information',
    enterFirstName: 'Enter first name',
    enterLastName: 'Enter last name',
    dateOfBirth: 'Date of Birth',
    enterEmailAddress: 'Enter email address',
    addressInformation: 'Address Information',
    enterCity: 'Enter city',
    enterStreetAddress: 'Enter street address',
    enterBuildingName: 'Enter building name',
    enterLocationArea: 'Enter location/area',
    continue: 'Continue',
    updatingProfile: 'Updating Profile...',
    authenticationTokenNotFound: 'Authentication token not found. Please try again.',
    profileUpdatedSuccessfully: 'Profile updated successfully!',
    failedToUpdateProfile: 'Failed to update profile. Please try again.',
    couldNotResendOtp: 'Could not resend OTP. Please try again.',
    failedToResendOtp: 'Failed to resend OTP. You can try again.',
    firstNameRequired: 'First name is required',
    firstNameMinLength: 'First name must be at least 2 characters',
    lastNameRequired: 'Last name is required',
    lastNameMinLength: 'Last name must be at least 2 characters',
    dayRequired: 'Day required',
    validDay: 'Please enter a valid day (1-31)',
    monthRequired: 'Month required',
    validMonth: 'Please enter a valid month (1-12)',
    yearRequired: 'Year required',
    validYear: 'Please enter a valid year',
    emailRequired: 'Email is required',
    validEmail: 'Please enter a valid email address',
    cityRequired: 'City is required',
    cityMinLength: 'City must be at least 2 characters',
    streetRequired: 'Street is required',
    streetMinLength: 'Street must be at least 2 characters',
    buildingNameRequired: 'Building name is required',
    buildingNameMinLength: 'Building name must be at least 2 characters',
    locationRequired: 'Location is required',
    locationMinLength: 'Location must be at least 2 characters',
    
    // EmailVerify
    verifyYourEmail: 'Verify your email',
    sentVerificationCode: "We've sent a 6-digit verification code to your email address. Please enter it below.",
    didntReceiveCode: "Didn't receive the code?",
    resending: 'Resending...',
    verifyEmail: 'Verify Email',
    verifying: 'Verifying...',
    pleaseEnterCompleteCode: 'Please enter the complete verification code',
    emailNotFound: 'Email not found. Please go back and try again.',
    emailVerifiedSuccessfully: 'Email verified successfully!',
    invalidOtp: 'Invalid OTP. Please try again.',
    otpSentSuccessfully: 'OTP has been sent Successfully.',
    failedToResendCode: 'Failed to resend code. Please try again.',
    
    // Add more translations as needed
  },
  ne: {
    // Settings
    settings: 'सेटिङ',
    search: 'खोज्नुहोस्',
    display: 'प्रदर्शन',
    language: 'भाषा',
    lightMode: 'उज्यालो मोड',
    darkMode: 'अँध्यारो मोड',
    english: 'English',
    nepali: 'नेपाली',
    apply: 'लागू गर्नुहोस्',
    
    // Login
    signInToAccount: 'तपाईंको खातामा साइन इन गर्नुहोस्',
    enterPhoneEmailUsername: 'फोन वा इमेल वा प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्',
    next: 'अर्को',
    checking: 'जाँच गर्दै...',
    dontHaveAccount: 'खाता छैन?',
    signUp: 'साइन अप गर्नुहोस्',
    pleaseEnterPhoneNumber: 'कृपया आफ्नो फोन नम्बर, इमेल, वा प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्',
    error: 'त्रुटि',
    userNotFound: 'प्रयोगकर्ता फेला परेन।',
    unexpectedError: 'अप्रत्याशित त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।',
    
    // EnterPassword
    welcomeBack: 'फेरि स्वागत छ',
    user: 'प्रयोगकर्ता',
    enterPasscode: 'पासकोड प्रविष्ट गर्नुहोस्',
    forgotPasscode: 'पासकोड बिर्सनुभयो?',
    useFaceIdToUnlock: 'अनलक गर्न Face ID प्रयोग गर्नुहोस्',
    faceIdAuthentication: 'Face ID प्रमाणीकरण',
    useFaceToUnlock: 'अनलक गर्न आफ्नो अनुहार प्रयोग गर्नुहोस्',
    placeFaceInCamera: 'क्यामेराको सामु आफ्नो अनुहार राख्नुहोस्',
    usePasscode: 'पासकोड प्रयोग गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    authenticationFailed: 'प्रमाणीकरण असफल',
    faceIdFailed: 'Face ID प्रमाणीकरण असफल भयो। कृपया फेरि प्रयास गर्नुहोस् वा पासकोड प्रयोग गर्नुहोस्।',
    ok: 'ठीक छ',
    forgotPasscodeTitle: 'पासकोड बिर्सनुभयो?',
    sendVerificationCode: 'हामी तपाईंको पासकोड रिसेट गर्न सत्यापन कोड पठाउनेछौं।',
    sendCode: 'कोड पठाउनुहोस्',
    identityNotFound: 'पहिचान फेला परेन। कृपया फेरि प्रयास गर्नुहोस्।',
    codeSent: 'कोड पठाइयो',
    verificationCodeSent: 'सत्यापन कोड सफलतापूर्वक पठाइयो',
    failed: 'असफल',
    failedToSendCode: 'सत्यापन कोड पठाउन असफल',
    success: 'सफल',
    loggedInSuccessfully: 'सफलतापूर्वक लग इन भयो!',
    loginFailed: 'लग इन असफल',
    invalidCredentials: 'अवैध प्रमाणपत्र। कृपया फेरि प्रयास गर्नुहोस्।',
    identityNotFoundGoBack: 'पहिचान फेला परेन। कृपया फिर्ता जानुहोस् र आफ्नो इमेल/फोन/प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्।',
    
    // Signup
    letsGetStarted: 'सुरु गरौं!',
    enterYourPhoneNumber: 'आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्',
    createAccount: 'खाता सिर्जना गर्नुहोस्',
    creatingAccount: 'खाता सिर्जना गर्दै...',
    alreadyHaveAccount: 'पहिले नै खाता छ?',
    signIn: 'साइन इन गर्नुहोस्',
    pleaseEnterPhoneNumber: 'कृपया आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्',
    pleaseEnterValidPhoneNumber: 'कृपया वैध फोन नम्बर प्रविष्ट गर्नुहोस्',
    accountCreatedSuccessfully: 'खाता सफलतापूर्वक सिर्जना भयो!',
    otpSentToPhone: 'तपाईंको फोनमा OTP पठाइयो।',
    failedToCreateAccount: 'खाता सिर्जना गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।',
    
    // CountryPicker
    selectCountry: 'देश छान्नुहोस्',
    search: 'खोज्नुहोस्',
    
    // PhoneVerify
    phoneVerification: 'फोन प्रमाणीकरण',
    enterVerificationCode: 'कृपया पठाइएको 4-अंकीय प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्',
    didntReceiveCode: 'कोड प्राप्त भएन?',
    submit: 'पेश गर्नुहोस्',
    verifying: 'प्रमाणीकरण गर्दै...',
    pleaseEnterOtp: 'कृपया OTP प्रविष्ट गर्नुहोस्',
    userIdentityNotFound: 'प्रयोगकर्ता पहिचान फेला परेन। कृपया फेरि साइन अप गर्नुहोस्।',
    phoneNumberVerified: 'फोन नम्बर सफलतापूर्वक प्रमाणित भयो!',
    invalidOtp: 'अवैध OTP। कृपया फेरि प्रयास गर्नुहोस्।',
    otpSentSuccessfully: 'OTP सफलतापूर्वक पठाइयो।',
    failedToResendCode: 'कोड पुनः पठाउन असफल। कृपया फेरि प्रयास गर्नुहोस्।',
    
    // EnterNameSign
    personalInformation: 'व्यक्तिगत जानकारी',
    providePersonalDetails: 'कृपया आफ्नो व्यक्तिगत विवरण र ठेगाना जानकारी प्रदान गर्नुहोस्',
    enterFirstName: 'पहिलो नाम प्रविष्ट गर्नुहोस्',
    enterLastName: 'अन्तिम नाम प्रविष्ट गर्नुहोस्',
    dateOfBirth: 'जन्म मिति',
    enterEmailAddress: 'इमेल ठेगाना प्रविष्ट गर्नुहोस्',
    addressInformation: 'ठेगाना जानकारी',
    enterCity: 'शहर प्रविष्ट गर्नुहोस्',
    enterStreetAddress: 'सडक ठेगाना प्रविष्ट गर्नुहोस्',
    enterBuildingName: 'भवन नाम प्रविष्ट गर्नुहोस्',
    enterLocationArea: 'स्थान/क्षेत्र प्रविष्ट गर्नुहोस्',
    continue: 'जारी राख्नुहोस्',
    updatingProfile: 'प्रोफाइल अपडेट गर्दै...',
    authenticationTokenNotFound: 'प्रमाणीकरण टोकन फेला परेन। कृपया फेरि प्रयास गर्नुहोस्।',
    profileUpdatedSuccessfully: 'प्रोफाइल सफलतापूर्वक अपडेट भयो!',
    failedToUpdateProfile: 'प्रोफाइल अपडेट गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।',
    couldNotResendOtp: 'OTP पुनः पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
    failedToResendOtp: 'OTP पुनः पठाउन असफल। तपाईं फेरि प्रयास गर्न सक्नुहुन्छ।',
    firstNameRequired: 'पहिलो नाम आवश्यक छ',
    firstNameMinLength: 'पहिलो नाम कम्तिमा २ अक्षर हुनुपर्छ',
    lastNameRequired: 'अन्तिम नाम आवश्यक छ',
    lastNameMinLength: 'अन्तिम नाम कम्तिमा २ अक्षर हुनुपर्छ',
    dayRequired: 'दिन आवश्यक छ',
    validDay: 'कृपया वैध दिन प्रविष्ट गर्नुहोस् (१-३१)',
    monthRequired: 'महिना आवश्यक छ',
    validMonth: 'कृपया वैध महिना प्रविष्ट गर्नुहोस् (१-१२)',
    yearRequired: 'वर्ष आवश्यक छ',
    validYear: 'कृपया वैध वर्ष प्रविष्ट गर्नुहोस्',
    emailRequired: 'इमेल आवश्यक छ',
    validEmail: 'कृपया वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्',
    cityRequired: 'शहर आवश्यक छ',
    cityMinLength: 'शहर कम्तिमा २ अक्षर हुनुपर्छ',
    streetRequired: 'सडक आवश्यक छ',
    streetMinLength: 'सडक कम्तिमा २ अक्षर हुनुपर्छ',
    buildingNameRequired: 'भवन नाम आवश्यक छ',
    buildingNameMinLength: 'भवन नाम कम्तिमा २ अक्षर हुनुपर्छ',
    locationRequired: 'स्थान आवश्यक छ',
    locationMinLength: 'स्थान कम्तिमा २ अक्षर हुनुपर्छ',
    
    // EmailVerify
    verifyYourEmail: 'आफ्नो इमेल प्रमाणित गर्नुहोस्',
    sentVerificationCode: 'हामीले तपाईंको इमेल ठेगानामा ६-अंकीय प्रमाणीकरण कोड पठाएका छौं। कृपया यसलाई तल प्रविष्ट गर्नुहोस्।',
    didntReceiveCode: 'कोड प्राप्त भएन?',
    resending: 'पुनः पठाउँदै...',
    verifyEmail: 'इमेल प्रमाणित गर्नुहोस्',
    verifying: 'प्रमाणीकरण गर्दै...',
    pleaseEnterCompleteCode: 'कृपया पूरा प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्',
    emailNotFound: 'इमेल फेला परेन। कृपया फिर्ता जानुहोस् र फेरि प्रयास गर्नुहोस्।',
    emailVerifiedSuccessfully: 'इमेल सफलतापूर्वक प्रमाणित भयो!',
    invalidOtp: 'अवैध OTP। कृपया फेरि प्रयास गर्नुहोस्।',
    otpSentSuccessfully: 'OTP सफलतापूर्वक पठाइयो।',
    failedToResendCode: 'कोड पुनः पठाउन असफल। कृपया फेरि प्रयास गर्नुहोस्।',
    
    // Add more translations as needed
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language from AsyncStorage
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
