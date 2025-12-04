import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from '../../components/CountryPicker';

const { width, height } = Dimensions.get('window');

const BennificalBank = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [transferType, setTransferType] = useState('Personal');
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryAddress: '',
    ibanNumber: '',
    beneficiaryBank: '',
    bankAddress: '',
    swiftCode: '',
    amount: '',
    currency: '',
    otherDetails: '',
    reasonAndPurpose: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.beneficiaryName.trim()) {
      newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    if (!formData.beneficiaryAddress.trim()) {
      newErrors.beneficiaryAddress = 'Beneficiary address is required';
    }

    if (!formData.ibanNumber.trim()) {
      newErrors.ibanNumber = 'IBAN number is required';
    } else if (!isValidIBAN(formData.ibanNumber)) {
      newErrors.ibanNumber = 'Please enter a valid IBAN number';
    }

    if (!formData.beneficiaryBank.trim()) {
      newErrors.beneficiaryBank = 'Beneficiary bank is required';
    }

    if (!formData.bankAddress.trim()) {
      newErrors.bankAddress = 'Bank address is required';
    }

    if (!selectedCountry) {
      newErrors.country = 'Please select a country';
    }

    if (!formData.swiftCode.trim()) {
      newErrors.swiftCode = 'SWIFT code is required';
    } else if (!isValidSWIFT(formData.swiftCode)) {
      newErrors.swiftCode = 'Please enter a valid SWIFT code';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    }

    if (!formData.reasonAndPurpose.trim()) {
      newErrors.reasonAndPurpose = 'Reason and purpose is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidIBAN = (iban) => {
    // Basic IBAN validation - should start with 2 letters followed by 2 digits and more characters
    // const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
      const swiftRegex = /^[A-Za-z0-9]+$/; 
  return swiftRegex.test(iban);

    // return ibanRegex.test(iban.replace(/\s/g, ''));
  };

  // const isValidSWIFT = (swift) => {
  //   // Basic SWIFT validation - should be 8 or 11 characters, letters and numbers
  //   const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  //   return swiftRegex.test(swift);
  // };

  const isValidSWIFT = (text) => {
  const swiftRegex = /^[A-Za-z0-9]+$/; 
  return swiftRegex.test(text);
};

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setErrors(prev => ({ ...prev, country: '' }));
  };

  const handleCompleteDetails = () => {
    if (validateForm()) {
      navigation.navigate("WesternUnion")
    } else {
      // Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerSpacer} />
      </View>
    </View>
  );

  const renderTransferTypeSelector = () => (
    <View style={styles.transferTypeContainer}>
      <TouchableOpacity
        style={[
          styles.transferTypeButton,
          {
            backgroundColor: transferType === 'Personal' ? '#FFFFFF' : theme.colors.surface,
          },
        ]}
        onPress={() => setTransferType('Personal')}
      >
        <Text
          style={[
            styles.transferTypeText,
            {
              color: transferType === 'Personal' ? '#169BFF' : theme.colors.text,
            },
          ]}
        >
          Personal
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.transferTypeButton,
          {
            backgroundColor: transferType === 'Business' ? '#FFFFFF' : theme.colors.surface,
          },
        ]}
        onPress={() => setTransferType('Business')}
      >
        <Text
          style={[
            styles.transferTypeText,
            {
              color: transferType === 'Business' ? '#169BFF' : theme.colors.text,
            },
          ]}
        >
          Business
        </Text>
      </TouchableOpacity>
    </View>
    
  );

  const renderFormField = (field, placeholder, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: errors[field] ? '#FF3B30' : theme.colors.border,
          },
          // multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const renderCountryField = () => (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={[
          styles.countryButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: errors.country ? '#FF3B30' : theme.colors.border,
          },
        ]}
        onPress={() => setIsCountryPickerVisible(true)}
      >
        <Text
          style={[
            styles.countryButtonText,
            {
              color: selectedCountry ? theme.colors.text : theme.colors.textSecondary,
            },
          ]}
        >
          {selectedCountry ? selectedCountry.name : 'Select Country'}
        </Text>
        <AntDesign name="down" size={16} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      {errors.country && (
        <Text style={styles.errorText}>{errors.country}</Text>
      )}
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      {renderFormField('beneficiaryName', 'Beneficiary Name')}
      {renderFormField('beneficiaryAddress', 'Beneficiary Address', 'default', true)}
      {renderFormField('ibanNumber', 'IBAN Number')}
      {renderFormField('beneficiaryBank', 'Beneficiary Bank')}
      {renderFormField('bankAddress', 'Bank Address', 'default', true)}

      <View style={styles.inputContainer}>
        {/* <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
          Select Country
        </Text> */}
        {renderCountryField()}
      </View>

      {renderFormField('swiftCode', 'Swift Code')}
      {renderFormField('amount', 'Amount', 'numeric')}
      {renderFormField('currency', 'Currency')}
      {renderFormField('otherDetails', 'Other Details', 'default', true)}
      {renderFormField('reasonAndPurpose', 'Reason and purpose', 'default', true)}
    </View>
  );

  const renderCompleteButton = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteDetails}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6B22E7', '#169BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.completeButtonText}>Complete All Details</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {renderHeader()}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
             Add Bank
            </Text>
          </View>

          {renderTransferTypeSelector()}
          {renderForm()}
        </ScrollView>

        {renderCompleteButton()}
      </KeyboardAvoidingView>

      <CountryPicker
        visible={isCountryPickerVisible}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    // textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transferTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 25,
    gap: 8,
  },
  transferTypeButton: {
    // flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'System',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  countryButtonText: {
    fontSize: 16,
    fontFamily: 'System',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 20,
    // backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default BennificalBank;
