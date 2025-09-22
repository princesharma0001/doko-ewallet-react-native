import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import CountryPicker from '../components/CountryPicker';
import Button from '../components/Button';

const CountryPickerTest = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    Alert.alert('Country Selected', `You selected: ${country.name} (${country.code})`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Country Picker Test
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Current Theme: {isDarkMode ? 'Dark' : 'Light'}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Toggle Theme"
            onPress={toggleTheme}
            variant="outline"
            style={styles.button}
          />
          
          <Button
            title={selectedCountry ? `Selected: ${selectedCountry.name}` : 'Select Country'}
            onPress={() => setIsCountryPickerVisible(true)}
            variant="primary"
            style={styles.button}
          />
        </View>

        {selectedCountry && (
          <View style={[styles.selectedCountry, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.selectedTitle, { color: theme.colors.text }]}>
              Selected Country:
            </Text>
            <Text style={[styles.selectedName, { color: theme.colors.text }]}>
              {selectedCountry.flag} {selectedCountry.name}
            </Text>
            <Text style={[styles.selectedCode, { color: theme.colors.textSecondary }]}>
              Code: {selectedCountry.code}
            </Text>
            <Text style={[styles.selectedCurrency, { color: theme.colors.textSecondary }]}>
              Currency: {selectedCountry.currency}
            </Text>
          </View>
        )}
      </View>

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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  button: {
    marginBottom: 10,
  },
  selectedCountry: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedName: {
    fontSize: 20,
    marginBottom: 5,
  },
  selectedCode: {
    fontSize: 16,
    marginBottom: 5,
  },
  selectedCurrency: {
    fontSize: 16,
  },
});

export default CountryPickerTest;
