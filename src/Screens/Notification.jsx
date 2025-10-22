import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userSettingsService } from '../services/apiService';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

// Custom Toggle Component
const CustomToggle = ({ value, onValueChange, disabled, theme }) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.primary],
  });

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[
        styles.toggleContainer,
        {
          backgroundColor: value ? theme.colors.primary + '40' : theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        }
      ]}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.toggleThumb,
          {
            backgroundColor: value ? theme.colors.primary : theme.colors.textSecondary,
            transform: [{ translateX }],
          }
        ]}
      />
    </TouchableOpacity>
  );
};

const Notification = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState({
    marketingOffers: true,
    transaction: true,
    investmentNews: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userSettings, setUserSettings] = useState(null);

  const notificationItems = React.useMemo(() => [
    {
      id: 'marketingOffers',
      icon: 'percent',
      title: t('marketingOffers'),
      description: t('marketingOffersDescription'),
    },
    {
      id: 'transaction',
      icon: 'swap-horizontal',
      title: t('transactions'),
      description: t('transactionsDescription'),
    },
    {
      id: 'investmentNews',
      icon: 'trending-up',
      title: t('investmentNews'),
      description: t('investmentNewsDescription'),
    },
  ], [t]);

  // Load user settings on component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        console.log('No token found, using default settings');
        setIsLoading(false);
        return;
      }

      console.log('Loading user settings from API...');
      const result = await userSettingsService.getUserSettings(token);

      if (result.success && result.data) {
        console.log('Settings loaded successfully:', result.data);
        
        // Store full user settings
        setUserSettings(result.data);
        
        // Extract notification settings from API response
        const notificationSettings = result.data.notificationSettings || {};
        
        // Update state with API data
        setNotifications({
          marketingOffers: notificationSettings.marketingOffers ?? true,
          transaction: notificationSettings.transaction ?? true,
          investmentNews: notificationSettings.investmentNews ?? true,
        });
        
        console.log('Notification settings updated:', {
          marketingOffers: notificationSettings.marketingOffers ?? true,
          transaction: notificationSettings.transaction ?? true,
          investmentNews: notificationSettings.investmentNews ?? true,
        });
      } else {
        console.log('Failed to load settings, using defaults:', result.error);
        Toast.show({
          type: 'error',
          text1: t('settings'),
          text2: result.error || t('failedToLoadNotificationSettings'),
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      Toast.show({
        type: 'error',
        text1: t('settings'),
        text2: t('failedToLoadNotificationSettings'),
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple toggle function for testing - no API calls
  const handleToggleSimple = (id) => {
    console.log('=== SIMPLE TOGGLE ===');
    console.log('Toggle clicked for:', id);
    console.log('Current value:', notifications[id]);

    setNotifications(prev => {
      const newState = {
        ...prev,
        [id]: !prev[id]
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleToggle = React.useCallback(async (id) => {
    console.log('=== TOGGLE START ===');
    console.log('Toggle clicked for:', id);
    console.log('Current notifications state:', notifications);
    console.log('Current value for', id, ':', notifications[id]);
    console.log('isUpdating:', isUpdating);

    if (isUpdating) {
      console.log('Already updating, ignoring toggle');
      return;
    }

    setIsUpdating(true);
    console.log('Set isUpdating to true');

    // Store the previous state for potential rollback
    const previousNotifications = { ...notifications };
    console.log('Previous state stored:', previousNotifications);

    try {
      // Update local state first for immediate UI feedback
      const updatedNotifications = {
        ...notifications,
        [id]: !notifications[id]
      };
      console.log('New state to set:', updatedNotifications);
      setNotifications(updatedNotifications);
      console.log('State updated in React');

      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        console.log('No token found, reverting state');
        setNotifications(previousNotifications);
        Alert.alert(t('error'), t('authenticationTokenNotFound'));
        return;
      }

      // Prepare API payload using current settings or defaults
      const settingsData = {
        themeMode: userSettings?.themeMode || "light",
        language: userSettings?.language || "en",
        notificationSettings: {
          marketingOffers: updatedNotifications.marketingOffers,
          transaction: updatedNotifications.transaction,
          investmentNews: updatedNotifications.investmentNews,
        }
      };

      console.log('Calling API with data:', settingsData);
      // Call API to update settings
      const result = await userSettingsService.updateUserSettings(settingsData, token);

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: t('notification'),
          text2: result?.message,
          position: 'top',
          visibilityTime: 4000,
        });
        console.log('API call successful:', result.data);
      } else {
        console.log('API call failed:', result.error);
        setNotifications(previousNotifications);
        Toast.show({
          type: 'error',
          text1: t('notification'),
          text2: result?.error,
          position: 'top',
          visibilityTime: 4000,
        });
        // Alert.alert('Error', result.error || 'Failed to update notification settings');
      }
    } catch (error) {
      console.error('Error in handleToggle:', error);
      setNotifications(previousNotifications);
      Toast.show({
        type: 'error',
        text1: t('notification'),
        text2: error.result?.error,
        position: 'top',
        visibilityTime: 4000,
      });
      // Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      console.log('Setting isUpdating to false');
      setIsUpdating(false);
      console.log('=== TOGGLE END ===');
    }
  }, [notifications, isUpdating]);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'percent':
        return <Text style={[styles.iconText, { color: theme.colors.primaryText }]}>%</Text>;
      case 'swap-horizontal':
        return <Ionicons name="swap-horizontal" size={20} color={theme.colors.primaryText} />;
      case 'trending-up':
        return <Ionicons name="trending-up" size={20} color={theme.colors.primaryText} />;
      default:
        return <Ionicons name="notifications" size={20} color={theme.colors.primaryText} />;
    }
  };

  const NotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
          {getIconComponent(item.icon)}
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>

          <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.toggleWrapper}>
        {/* {isUpdating && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.loadingIndicator}
          />
        )} */}
        <CustomToggle
          value={notifications[item.id]}
          onValueChange={() => handleToggle(item.id)}
          disabled={isUpdating}
          theme={theme}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
          {t('notifications')}
        </Text>


        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              {t('loadingSettings')}
            </Text>
          </View>
        ) : (
          <View style={[styles.notificationsContainer, { backgroundColor: theme.colors.surface }]}>
            {notificationItems.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationsContainer: {
    borderRadius: 16,
    paddingVertical: 8,
    marginTop: 20,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 80,
    borderRadius:16
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'System',
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'System',
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: -10,
  },
  toggleContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingIndicator: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  debugText: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'System',
  },
});

export default Notification;
