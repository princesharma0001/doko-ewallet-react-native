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

const EnterNameSign = ({ navigation }) => {
  const { theme } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Date of Birth validation
    if (!day.trim()) {
      newErrors.day = 'Day required';
    } else if (!/^\d{1,2}$/.test(day) || parseInt(day) < 1 || parseInt(day) > 31) {
      newErrors.day = 'Please enter a valid day (1-31)';
    }

    if (!month.trim()) {
      newErrors.month = 'Month required';
    } else if (!/^\d{1,2}$/.test(month) || parseInt(month) < 1 || parseInt(month) > 12) {
      newErrors.month = 'Please enter a valid month (1-12)';
    }

    if (!year.trim()) {
      newErrors.year = 'Year required';
    } else if (!/^\d{4}$/.test(year) || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear()) {
      newErrors.year = 'Please enter a valid year';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!city.trim()) {
      newErrors.city = 'City is required';
    } else if (city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    if (!street.trim()) {
      newErrors.street = 'Street is required';
    } else if (street.trim().length < 2) {
      newErrors.street = 'Street must be at least 2 characters';
    }

    if (!buildingName.trim()) {
      newErrors.buildingName = 'Building name is required';
    } else if (buildingName.trim().length < 2) {
      newErrors.buildingName = 'Building name must be at least 2 characters';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    } else if (location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        dateOfBirth: {
          day: day.trim(),
          month: month.trim(),
          year: year.trim(),
          formatted: `${day.trim()}/${month.trim()}/${year.trim()}`
        },
        email: email.trim(),
        address: {
          city: city.trim(),
          street: street.trim(),
          buildingName: buildingName.trim(),
          location: location.trim(),
          fullAddress: `${street.trim()}, ${buildingName.trim()}, ${city.trim()}, ${location.trim()}`
        }
      };

      console.log('User data:', userData);
      navigation.navigate('EmailVerify', { userData });
    }
  };

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'day':
        setDay(value);
        break;
      case 'month':
        setMonth(value);
        break;
      case 'year':
        setYear(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'street':
        setStreet(value);
        break;
      case 'buildingName':
        setBuildingName(value);
        break;
      case 'location':
        setLocation(value);
        break;
      default:
        break;
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
                Personal Information
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
                Please provide your personal details and address information
              </Text>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                {/* First Name Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.firstName ? '#FF3B30' : '#3D4065',
                        color: errors.firstName ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder="Enter first name"
                    placeholderTextColor="#8C90BF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>

                {/* Last Name Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.lastName ? '#FF3B30' : '#3D4065',
                        color: errors.lastName ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder="Enter last name"
                    placeholderTextColor="#8C90BF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>

                {/* Date of Birth Section */}
                <Text style={[styles.sectionTitle,{color:theme.colors.text}]}>Date of Birth</Text>

                {/* Date of Birth Inputs */}
                <View style={styles.dateOfBirthContainer}>
                  <View style={styles.dateInputWrapper}>
                    <TextInput
                      style={[
                        styles.dateInput,
                        {
                          borderColor: errors.day ? '#FF3B30' : '#3D4065',
                          color: errors.day ? '#FF3B30' : theme.colors.text,
                        },
                      ]}
                      value={day}
                      onChangeText={(value) => handleInputChange('day', value)}
                      placeholder="DD"
                      placeholderTextColor="#8C90BF"
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="next"
                    />
                    {errors.day && (
                      <Text style={styles.errorText}>{errors.day}</Text>
                    )}
                  </View>

                  <View style={styles.dateInputWrapper}>
                    <TextInput
                      style={[
                        styles.dateInput,
                        {
                          borderColor: errors.month ? '#FF3B30' : '#3D4065',
                          color: errors.month ? '#FF3B30' : theme.colors.text,
                        },
                      ]}
                      value={month}
                      onChangeText={(value) => handleInputChange('month', value)}
                      placeholder="MM"
                      placeholderTextColor="#8C90BF"
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="next"
                    />
                    {errors.month && (
                      <Text style={styles.errorText}>{errors.month}</Text>
                    )}
                  </View>

                  <View style={styles.dateInputWrapper}>
                    <TextInput
                      style={[
                        styles.dateInput,
                        {
                          borderColor: errors.year ? '#FF3B30' : '#3D4065',
                          color: errors.year ? '#FF3B30' : theme.colors.text,
                        },
                      ]}
                      value={year}
                      onChangeText={(value) => handleInputChange('year', value)}
                      placeholder="YYYY"
                      placeholderTextColor="#8C90BF"
                      keyboardType="numeric"
                      maxLength={4}
                      returnKeyType="next"
                    />
                    {errors.year && (
                      <Text style={styles.errorText}>{errors.year}</Text>
                    )}
                  </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.email ? '#FF3B30' : '#3D4065',
                        color: errors.email ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter email address"
                    placeholderTextColor="#8C90BF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Address Section */}
                <Text style={[styles.sectionTitle,{color:theme.colors.text}]}>Address Information</Text>

                {/* City Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.city ? '#FF3B30' : '#3D4065',
                        color: errors.city ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={city}
                    onChangeText={(value) => handleInputChange('city', value)}
                    placeholder="Enter city"
                    placeholderTextColor="#8C90BF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  )}
                </View>

                {/* Street Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.street ? '#FF3B30' : '#3D4065',
                        color: errors.street ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={street}
                    onChangeText={(value) => handleInputChange('street', value)}
                    placeholder="Enter street address"
                    placeholderTextColor="#8C90BF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.street && (
                    <Text style={styles.errorText}>{errors.street}</Text>
                  )}
                </View>

                {/* Building Name Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.buildingName ? '#FF3B30' : '#3D4065',
                        color: errors.buildingName ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={buildingName}
                    onChangeText={(value) => handleInputChange('buildingName', value)}
                    placeholder="Enter building name"
                    placeholderTextColor="#8C90BF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.buildingName && (
                    <Text style={styles.errorText}>{errors.buildingName}</Text>
                  )}
                </View>

                {/* Location Input */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: errors.location ? '#FF3B30' : '#3D4065',
                        color: errors.location ? '#FF3B30' : theme.colors.text,
                      },
                    ]}
                    value={location}
                    onChangeText={(value) => handleInputChange('location', value)}
                    placeholder="Enter location/area"
                    placeholderTextColor="#8C90BF"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />
                  {errors.location && (
                    <Text style={styles.errorText}>{errors.location}</Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
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
                    styles.continueText,
                    {
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.medium,
                    },
                  ]}
                >
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>

            </View>
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
    // justifyContent: 'center',
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
    // textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: {
    // textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    gap: 12,
  },
  inputWrapper: {
    marginBottom: 4,
  },
  textInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'System',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    // marginTop: 12,
    // marginBottom: 8,
    fontFamily: 'System',
  },
  dateOfBirthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateInputWrapper: {
    flex: 1,
    marginBottom: 4,
  },
  dateInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'System',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    paddingTop: 16,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  continueButton: {
    marginBottom: 16,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    textAlign: 'center',
  },
  signInLink: {
    textDecorationLine: 'underline',
  },
});

export default EnterNameSign;
