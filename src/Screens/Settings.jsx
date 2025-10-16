import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const Settings = ({ navigation }) => {
  const { theme, isDarkMode, setTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState(75);
  const [fontWeight, setFontWeight] = useState(60);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleApply = () => {
    // Handle apply settings
    console.log('Settings applied:', { isDarkMode, fontSize, fontWeight });
    navigation.goBack();
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text
      }]}>
        {t('settings')}
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, {
            fontFamily: theme.typography.fontFamily,
            color: theme.colors.text
          }]}
          placeholder={t('search')}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
    </View>
  );

  const renderDisplaySection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text
      }]}>
        {t('display')}
      </Text>
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[
            styles.modeCard,
            { backgroundColor: theme.colors.surface },
            !isDarkMode && styles.selectedModeCard
          ]}
          onPress={() => setTheme('light')}
        >
          <Ionicons
            name="sunny"
            size={24}
            color={!isDarkMode ? theme.colors.primary : theme.colors.text}
          />
          <Text style={[
            styles.modeText,
            {
              fontFamily: theme.typography.fontFamily,
              color: !isDarkMode ? theme.colors.primary : theme.colors.text
            }
          ]}>
            {t('lightMode')}
          </Text>
          <View style={[
            styles.radioButton,
            { borderColor: theme.colors.border },
            !isDarkMode && styles.selectedRadioButton
          ]}>
            {!isDarkMode && (
              <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeCard,
            { backgroundColor: theme.colors.surface },
            isDarkMode && styles.selectedModeCard
          ]}
          onPress={() => setTheme('dark')}
        >
          <Ionicons
            name="moon"
            size={24}
            color={isDarkMode ? theme.colors.primary : theme.colors.text}
          />
          <Text style={[
            styles.modeText,
            {
              fontFamily: theme.typography.fontFamily,
              color: isDarkMode ? theme.colors.primary : theme.colors.text
            }
          ]}>
            {t('darkMode')}
          </Text>
          <View style={[
            styles.radioButton,
            { borderColor: theme.colors.border },
            isDarkMode && styles.selectedRadioButton
          ]}>
            {isDarkMode && (
              <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLanguageSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text
      }]}>
        {t('language')}
      </Text>
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[
            styles.modeCard,
            { backgroundColor: theme.colors.surface },
            language === 'en' && styles.selectedModeCard
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Ionicons
            name="globe"
            size={24}
            color={language === 'en' ? theme.colors.primary : theme.colors.text}
          />
          <Text style={[
            styles.modeText,
            {
              fontFamily: theme.typography.fontFamily,
              color: language === 'en' ? theme.colors.primary : theme.colors.text
            }
          ]}>
            {t('english')}
          </Text>
          <View style={[
            styles.radioButton,
            { borderColor: theme.colors.border },
            language === 'en' && styles.selectedRadioButton
          ]}>
            {language === 'en' && (
              <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeCard,
            { backgroundColor: theme.colors.surface },
            language === 'ne' && styles.selectedModeCard
          ]}
          onPress={() => changeLanguage('ne')}
        >
          <Ionicons
            name="globe"
            size={24}
            color={language === 'ne' ? theme.colors.primary : theme.colors.text}
          />
          <Text style={[
            styles.modeText,
            {
              fontFamily: theme.typography.fontFamily,
              color: language === 'ne' ? theme.colors.primary : theme.colors.text
            }
          ]}>
            {t('nepali')}
          </Text>
          <View style={[
            styles.radioButton,
            { borderColor: theme.colors.border },
            language === 'ne' && styles.selectedRadioButton
          ]}>
            {language === 'ne' && (
              <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFontSizeSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text
      }]}>
        Font Size
      </Text>
      <View style={styles.sliderContainer}>
        <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.sliderProgress, {
            width: `${fontSize}%`,
            backgroundColor: theme.colors.primary
          }]} />
          <TouchableOpacity
            style={[styles.sliderThumb, {
              left: `${fontSize}%`,
              backgroundColor: theme.colors.primary
            }]}
            onPress={() => setFontSize(Math.min(100, fontSize + 10))}
          />
        </View>
        <Text style={[styles.sliderValue, {
          fontFamily: theme.typography.fontFamily,
          color: theme.colors.primary
        }]}>{fontSize}%</Text>
      </View>
    </View>
  );

  const renderFontWeightSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text
      }]}>
        Font Weight
      </Text>
      <View style={styles.sliderContainer}>
        <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.sliderProgress, {
            width: `${fontWeight}%`,
            backgroundColor: theme.colors.primary
          }]} />
          <TouchableOpacity
            style={[styles.sliderThumb, {
              left: `${fontWeight}%`,
              backgroundColor: theme.colors.primary
            }]}
            onPress={() => setFontWeight(Math.min(100, fontWeight + 10))}
          />
        </View>
        <Text style={[styles.sliderValue, {
          fontFamily: theme.typography.fontFamily,
          color: theme.colors.primary
        }]}>{fontWeight}%</Text>
      </View>
      <Text style={[styles.exampleText, {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.textSecondary
      }]}>
        E.g., Lorem ipsum is a dummy Text.
      </Text>
    </View>
  );

  const renderApplyButton = () => (
    <View style={styles.applyButtonContainer}>
      <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.colors.primary }]} onPress={handleApply}>
        <Text style={[styles.applyButtonText, {
          fontFamily: theme.typography.fontFamily,
          color: '#FFFFFF'
        }]}>
          {t('apply')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {renderHeader()}
      {renderSearchBar()}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderDisplaySection()}
        {renderLanguageSection()}
        {/* {renderFontSizeSection()} */}
        {/* {renderFontWeightSection()} */}
      </ScrollView>

      {renderApplyButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  modeCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedModeCard: {
    borderColor: '#169BFF',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#169BFF',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
    marginBottom: 10,
  },
  sliderProgress: {
    height: 4,
    borderRadius: 2,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -8,
    transform: [{ translateX: -10 }],
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  exampleText: {
    fontSize: 14,
    marginTop: 10,
  },
  applyButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#169BFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Settings;
