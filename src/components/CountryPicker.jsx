import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

// Country data with flags and codes
const countries = [
  { name: 'Poland Gold', code: '+01', flag: '🇵🇱', currency: 'PLN' },
  { name: 'Monaco', code: '+03', flag: '🇲🇨', currency: 'EUR' },
  { name: 'Cuba', code: '+91', flag: '🇨🇺', currency: 'CUP' },
  { name: 'Euro', code: '+23', flag: '🇪🇺', currency: 'EUR' },
  { name: 'United Kingdom', code: '+59', flag: '🇬🇧', currency: 'GBP' },
  { name: 'United States', code: '+1', flag: '🇺🇸', currency: 'USD' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', currency: 'CAD' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', currency: 'EUR' },
  { name: 'France', code: '+33', flag: '🇫🇷', currency: 'EUR' },
  { name: 'Italy', code: '+39', flag: '🇮🇹', currency: 'EUR' },
  { name: 'Spain', code: '+34', flag: '🇪🇸', currency: 'EUR' },
  { name: 'Japan', code: '+81', flag: '🇯🇵', currency: 'JPY' },
  { name: 'China', code: '+86', flag: '🇨🇳', currency: 'CNY' },
  { name: 'India', code: '+91', flag: '🇮🇳', currency: 'INR' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', currency: 'AUD' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷', currency: 'BRL' },
  { name: 'Russia', code: '+7', flag: '🇷🇺', currency: 'RUB' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷', currency: 'KRW' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽', currency: 'MXN' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', currency: 'EUR' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪', currency: 'SEK' },
  { name: 'Norway', code: '+47', flag: '🇳🇴', currency: 'NOK' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰', currency: 'DKK' },
  { name: 'Finland', code: '+358', flag: '🇫🇮', currency: 'EUR' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭', currency: 'CHF' },
  { name: 'Austria', code: '+43', flag: '🇦🇹', currency: 'EUR' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪', currency: 'EUR' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹', currency: 'EUR' },
  { name: 'Greece', code: '+30', flag: '🇬🇷', currency: 'EUR' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷', currency: 'TRY' },
  { name: 'Israel', code: '+972', flag: '🇮🇱', currency: 'ILS' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', currency: 'ZAR' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬', currency: 'EGP' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', currency: 'NGN' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪', currency: 'KES' },
  { name: 'Morocco', code: '+212', flag: '🇲🇦', currency: 'MAD' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷', currency: 'ARS' },
  { name: 'Chile', code: '+56', flag: '🇨🇱', currency: 'CLP' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴', currency: 'COP' },
  { name: 'Peru', code: '+51', flag: '🇵🇪', currency: 'PEN' },
  { name: 'Venezuela', code: '+58', flag: '🇻🇪', currency: 'VES' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭', currency: 'THB' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳', currency: 'VND' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩', currency: 'IDR' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾', currency: 'MYR' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', currency: 'SGD' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭', currency: 'PHP' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿', currency: 'NZD' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', currency: 'SAR' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', currency: 'AED' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦', currency: 'QAR' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼', currency: 'KWD' },
  { name: 'Bahrain', code: '+973', flag: '🇧🇭', currency: 'BHD' },
  { name: 'Oman', code: '+968', flag: '🇴🇲', currency: 'OMR' },
  { name: 'Jordan', code: '+962', flag: '🇯🇴', currency: 'JOD' },
  { name: 'Lebanon', code: '+961', flag: '🇱🇧', currency: 'LBP' },
  { name: 'Iraq', code: '+964', flag: '🇮🇶', currency: 'IQD' },
  { name: 'Iran', code: '+98', flag: '🇮🇷', currency: 'IRR' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', currency: 'PKR' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩', currency: 'BDT' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰', currency: 'LKR' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵', currency: 'NPR' },
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫', currency: 'AFN' },
];

const CountryPicker = ({ visible, onClose, onSelect, selectedCountry }) => {
    const { theme, isDarkMode } = useTheme();
    const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.includes(searchQuery)
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery]);

  const handleSelectCountry = (country) => {
    onSelect(country);
    onClose();
  };

  const renderCountryItem = ({ item, index }) => {
    const isSelected = selectedCountry && selectedCountry.code === item.code;
    
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          {
            backgroundColor: isSelected ? theme.colors.border : 'transparent',
            borderRadius: isSelected ? 10 : 0,
            marginHorizontal: isSelected ? 15 : 15,
          },
        ]}
        onPress={() => handleSelectCountry(item)}
        activeOpacity={0.7}
      >
        <View style={styles.countryInfo}>
          <View style={[styles.flagContainer, { backgroundColor: theme.colors.border }]}>
            <Text style={styles.flagEmoji}>{item.flag}</Text>
          </View>
          <View style={styles.countryDetails}>
            <Text
              style={[
                styles.countryName,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.medium,
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.countryCode,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {item.code}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.colors.surface,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
{t('selectCountry')}
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.border }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.searchIcon, { color: theme.colors.textSecondary }]}>🔍</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder={t('search')}
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={false}
              />
            </View>
          </View>

          {/* Countries List */}
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            style={styles.countriesList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  countriesList: {
    flex: 1,
  },
  countryItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    // borderBottomWidth: 1,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  flagEmoji: {
    fontSize: 20,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  countryCode: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default CountryPicker;
