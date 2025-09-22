import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const WesternUnion = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryAddress: '',
    country: '',
    swiftCode: '',
    amount: '',
    phoneNumber: '',
    currency: '',
    reason: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = (field, value) => {
    switch (field) {
      case 'beneficiaryName':
        if (!value.trim()) return 'Beneficiary name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'beneficiaryAddress':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please enter a complete address';
        return '';

      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';

      case 'swiftCode':
        if (!value.trim()) return 'SWIFT code is required';
        if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.trim())) {
          return 'Please enter a valid SWIFT code';
        }
        return '';

      case 'amount':
        if (!value.trim()) return 'Amount is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          return 'Please enter a valid amount';
        }
        return '';

      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';

      case 'currency':
        if (!value.trim()) return 'Currency is required';
        if (value.trim().length !== 3) return 'Please enter a valid 3-letter currency code';
        return '';

      case 'reason':
        if (!value.trim()) return 'Reason and purpose is required';
        if (value.trim().length < 5) return 'Please provide a detailed reason';
        return '';

      default:
        return '';
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
     navigation.navigate("WesternUnionPreview");
    if (validateForm()) {
      Alert.alert(
        'Success',
        'All details have been completed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back or to next screen
              navigation.navigate("WesternUnionPreview");
            },
          },
        ]
      );
    } else {
      // Alert.alert('Validation Error', 'Please complete all required fields correctly.');
    }
  };

  // Input field component
  const InputField = ({ field, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#2C2C37' : '#F8F9FA',
            borderColor: errors[field] ? '#FF3B30' : (isDarkMode ? '#464665' : '#E9ECEF'),
            color: isDarkMode ? '#FFFFFF' : '#1C1C27',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.sizes.md,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#9E9E9E' : '#6C757D'}
        value={formData[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] && (
        <Text style={[styles.errorText, { color: '#FF3B30' }]}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.headerButton,
              { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
            ]}
          >
            <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
          </TouchableOpacity>


        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,paddingBottom:10 }}>

          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.sizes.xxl,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            Western Union
          </Text>

          <TouchableOpacity
            style={[
              styles.headerButton,
              { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
            ]}
          >
            <MaterialIcons name="person" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Form Container */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            {/* Beneficiary Name */}
            <InputField
              field="beneficiaryName"
              placeholder="Beneficiary Name"
            />

            {/* Beneficiary Address */}
            <InputField
              field="beneficiaryAddress"
              placeholder="Beneficiary Address"
              multiline={true}
            />

            {/* Country */}
            <InputField
              field="country"
              placeholder="Country Predefined"
            />

            {/* SWIFT Code */}
            <InputField
              field="swiftCode"
              placeholder="Swift Code"
            />

            {/* Amount */}
            <InputField
              field="amount"
              placeholder="Amount"
              keyboardType="numeric"
            />

            {/* Phone Number */}
            <InputField
              field="phoneNumber"
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />

            {/* Currency */}
            <InputField
              field="currency"
              placeholder="Currency"
            />

            {/* Reason and Purpose */}
            <InputField
              field="reason"
              placeholder="Reason and purpose"
              multiline={true}
            />
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
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
                  styles.submitButtonText,
                  {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.bold,
                  },
                ]}
              >
                Complete All Details
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    // textAlign: 'center',
    // marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    // minHeight: 56,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default WesternUnion;
