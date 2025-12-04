import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ApplyCard = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Card color options
  const cardColors = [
    { id: 1, name: 'Blue', gradient: ['#1AA5FF', '#6B22E7'] },
    { id: 2, name: 'Green', gradient: ['#10B981', '#059669'] },
    { id: 3, name: 'Purple', gradient: ['#8B5CF6', '#6D28D9'] },
  ];

  // State
  const [selectedColor, setSelectedColor] = useState(cardColors[0]);
  const [selectedCardType, setSelectedCardType] = useState('Physical'); // 'Physical' | 'Virtual'
  const [cardTitle, setCardTitle] = useState('');
  const [cardPlaceholder, setCardPlaceholder] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState({
    cardTitle: '',
    cardPlaceholder: '',
  });

  // Validate card title
  const validateCardTitle = (title) => {
    if (!title.trim()) return 'Card title is required';
    if (title.trim().length < 2) return 'Title must be at least 2 characters';
    return '';
  };

  // Validate card placeholder
  const validateCardPlaceholder = (placeholder) => {
    if (!placeholder.trim()) return 'Placeholder text is required';
    if (placeholder.trim().length < 3) return 'Placeholder must be at least 3 characters';
    return '';
  };

  // Handle input changes with validation
  const handleCardTitleChange = (text) => {
    setCardTitle(text);
    setErrors({ ...errors, cardTitle: validateCardTitle(text) });
  };

  const handleCardPlaceholderChange = (text) => {
    setCardPlaceholder(text);
    setErrors({ ...errors, cardPlaceholder: validateCardPlaceholder(text) });
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {
      cardTitle: validateCardTitle(cardTitle),
      cardPlaceholder: validateCardPlaceholder(cardPlaceholder),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Handle apply button press
  const handleApply = () => {
    if (validateAll()) {
      // Navigate to ApplyCardView with selected data
      navigation.navigate('ApplyCardView', {
        selectedColor,
        cardType: selectedCardType,
        cardTitle,
        cardPlaceholder,
      });
    }
  };

  // Render card type selector
  const renderCardTypeSelector = () => (
    <View style={styles.cardTypeContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Select Card Type
      </Text>
      <View style={styles.cardTypeRow}>
        {['Physical', 'Virtual'].map((type) => {
          const isActive = selectedCardType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.cardTypeOption,
                {
                  backgroundColor: isActive
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: isActive
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedCardType(type)}
            >
              <Text
                style={[
                  styles.cardTypeText,
                  {
                    color: isActive ? '#FFFFFF' : theme.colors.text,
                  },
                ]}
              >
                {type} Card
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Render card preview
  const renderCardPreview = () => (
    <View style={styles.cardPreviewContainer}>
      <LinearGradient
        colors={selectedColor.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardPreview}
      >
        {/* Card Chip */}
        <View style={styles.cardChip}>
          <View style={styles.chipLines} />
        </View>

        {/* Card Number */}
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumberText}>
            1234 5678 9012 3456
          </Text>
        </View>

        {/* Card Details Row */}
        <View style={styles.cardDetailsRow}>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
            <Text style={styles.cardDetailValue}>
              JOHN DOE
            </Text>
          </View>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>EXPIRES</Text>
            <Text style={styles.cardDetailValue}>
              12/25
            </Text>
          </View>
        </View>

        {/* CVV (hidden by default, shown when needed) */}
        <View style={styles.cvvContainer}>
          <Text style={styles.cvvLabel}>CVV</Text>
          <Text style={styles.cvvValue}>***</Text>
        </View>
      </LinearGradient>
    </View>
  );

  // Render color options
  const renderColorOptions = () => (
    <View style={styles.colorOptionsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Choose Card Color
      </Text>
      <View style={styles.colorOptionsRow}>
        {cardColors.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={styles.colorOption}
            onPress={() => setSelectedColor(color)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={color.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.colorGradient,
                selectedColor.id === color.id && {
                  borderColor: theme.colors.primary || '#1AA5FF',
                  borderWidth: 3,
                },
              ]}
            >
              {selectedColor.id === color.id && (
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              )}
            </LinearGradient>
            <Text style={[styles.colorName, { color: theme.colors.text }]}>
              {color.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Header with Back Icon */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Apply Card
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Card Preview */}
        {renderCardPreview()}

        {/* Card Type */}
        {renderCardTypeSelector()}

        {/* Color Options */}
        {renderColorOptions()}

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {/* Card Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Card Title
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: errors.cardTitle
                    ? theme.colors.error || '#FF1A1A'
                    : theme.colors.border,
                },
              ]}
              placeholder="Enter card title"
              placeholderTextColor={theme.colors.textSecondary}
              value={cardTitle}
              onChangeText={handleCardTitleChange}
            />
            {errors.cardTitle ? (
              <Text style={styles.errorText}>{errors.cardTitle}</Text>
            ) : null}
          </View>

          {/* Card Placeholder Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Card Placeholder Text
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: errors.cardPlaceholder
                    ? theme.colors.error || '#FF1A1A'
                    : theme.colors.border,
                },
              ]}
              placeholder="Enter placeholder text"
              placeholderTextColor={theme.colors.textSecondary}
              value={cardPlaceholder}
              onChangeText={handleCardPlaceholderChange}
              multiline
              numberOfLines={3}
            />
            {errors.cardPlaceholder ? (
              <Text style={styles.errorText}>{errors.cardPlaceholder}</Text>
            ) : null}
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <LinearGradient
           colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
           start={{ x: 0, y: 0 }}
           end={{ x: 1.5, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.applyButtonText}>Apply Card</Text>
          </LinearGradient>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardPreviewContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  cardPreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardChip: {
    width: 50,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLines: {
    width: 30,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
  cardNumberContainer: {
    marginTop: 20,
  },
  cardNumberText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'System',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardDetailItem: {
    flex: 1,
  },
  cardDetailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontFamily: 'System',
  },
  cardDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  cvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cvvLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
    fontFamily: 'System',
  },
  cvvValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  colorOptionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'System',
  },
  colorOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  colorOption: {
    flex: 1,
    alignItems: 'center',
  },
  colorGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  cardTypeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTypeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTypeText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'System',
  },
  errorText: {
    color: '#FF1A1A',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'System',
  },
  applyButton: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
});

export default ApplyCard;

