import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');

const AccountBottomSheet = ({ isVisible, onClose, onSelectAccount, selectedAccount }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const pan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset pan value
      pan.setValue(0);
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, slideAnim, pan]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to vertical swipes
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
    },
    onPanResponderGrant: () => {
      pan.setOffset(pan._value);
    },
    onPanResponderMove: (evt, gestureState) => {
      // Only allow downward movement
      if (gestureState.dy > 0) {
        pan.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      pan.flattenOffset();

      // If user swiped down more than 100px, close the modal
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        onClose();
      } else {
        // Snap back to original position
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const accountOptions = [
    {
      id: 'current',
      title: t('currentAccount'),
      icon: 'account-balance',
      iconType: 'MaterialIcons',
    },
    {
      id: 'card',
      title: t('cardAccount'),
      icon: 'credit-card',
      iconType: 'MaterialIcons',
    },

    // {
    //   id: 'crypto',
    //   title: t('cryptoAccount'),
    //   icon: 'credit-card',
    //   iconType: 'MaterialIcons',
    // },

  ];

  const handleAccountSelect = (account) => {
    onSelectAccount(account);
    onClose();
  };

  const renderAccountOption = (account) => {
    const IconComponent = account.iconType === 'MaterialIcons' ? MaterialIcons : Ionicons;
    const isSelected = selectedAccount === account.id;

    return (
      <TouchableOpacity
        key={account.id}
        style={[
          styles.accountOption,
          {
            // backgroundColor: "red",
            // borderBottomColor: theme.colors.surface,
          },
          isSelected && { backgroundColor: theme.colors.border }
        ]}
        onPress={() => handleAccountSelect(account)}
      >
        <View style={styles.accountLeft}>
          <View style={[styles.accountIcon, { backgroundColor: theme.colors.background }]}>
            <IconComponent
              name={account.icon}
              size={24}
              color={isSelected ? theme.colors.primary : theme.colors.text}
            />
          </View>
          <Text style={[
            styles.accountTitle,
            {
              color: isSelected ? theme.colors.primary : theme.colors.text,
              fontWeight: isSelected ? '600' : '500'
            }
          ]}>
            {account.title}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: theme.colors.background,
              transform: [{ translateY: Animated.add(slideAnim, pan) }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <StatusBar
            barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
          />

          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
             {t('selectAccount')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Account Options */}
          <View style={styles.optionsContainer}>
            {accountOptions.map(renderAccountOption)}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 8,
    // borderBottomWidth: 1,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  accountTitle: {
    fontSize: 16,
    flex: 1,
  },
});

export default AccountBottomSheet;
