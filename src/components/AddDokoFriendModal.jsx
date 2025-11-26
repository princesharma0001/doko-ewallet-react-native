import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  Image,
  TouchableHighlight,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchUsernameModal from './SearchUsernameModal';

const { width, height } = Dimensions.get('window');

const AddDokoFriendModal = ({ visible, onClose,onClose1, onSelectOption }) => {
  const { theme } = useTheme();
  const [showSearchUsernameModal, setShowSearchUsernameModal] = useState(false);
  console.log("Asdfsadg",showSearchUsernameModal);
  

  const friendOptions = [
    {
      id: 'search-username',
      title: 'Search by Username',
      description: 'Find your friends using by their username',
      icon: 'search1',
      iconType: 'AntDesign',
      iconColor: '#8B5CF6',
      image: require('../assets/Images/searches.png'),
      type: "username"
    },
    {
      id: 'add-phone-email',
      title: 'Add phone or email',
      description: 'Add their contact details',
      icon: 'smartphone',
      iconType: 'Ionicons',
      iconColor: '#EC4899',
      image: require('../assets/Images/phjones.png'),
      type: "phone"

    },
    {
      id: 'scan-qr',
      title: 'Scan QR code',
      description: 'Pay your friend\'s using QR code',
      icon: 'qr-code-scanner',
      iconType: 'MaterialIcons',
      iconColor: '#3B82F6',
      image: require('../assets/Images/QRS.png'),

    },
  ];

  const handleOptionPress = (option) => {
    console.log('Selected option:', option.title);
    if (option.type === 'username' || option.type === 'phone') {
      setShowSearchUsernameModal(true);
    } else {
      onSelectOption(option);
    }
  };

  const handleUserSelect = (user) => {
    console.log('Selected user:', user.username);
    setShowSearchUsernameModal(false);
    onSelectOption({ ...user, type: 'search-username-result' });
  };

  const getIconComponent = (iconName, iconType, iconColor) => {
    const iconSize = 24;
    const iconProps = { size: iconSize, color: iconColor };

    switch (iconType) {
      case 'AntDesign':
        return <AntDesign name={iconName} {...iconProps} />;
      case 'Ionicons':
        return <Ionicons name={iconName} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} {...iconProps} />;
      default:
        return <Ionicons name="person" {...iconProps} />;
    }
  };

  const OptionItem = ({ option }) => (
    <TouchableHighlight
      style={styles.optionItem}
      onPress={() => handleOptionPress(option)}
      underlayColor={theme.colors.surface} // highlight color when pressed
    >
      <View style={styles.optionContent}>
        <View style={styles.iconContainer}>
          <Image
            source={option.image}
            style={{ width: 45, height: 45, resizeMode: 'contain' }}
          />
          {/* {getIconComponent(option.icon, option.iconType, option.iconColor)} */}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
            {option.title}
          </Text>
          <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
            {option.description}
          </Text>
        </View>
        <AntDesign
          name="right"
          size={16}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableHighlight>
  );


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            {/* <View style={{ width: 24 }} /> */}
          </View>
          <View style={{ paddingHorizontal: 20, paddingBottom: 25 }}>
            <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xl, fontWeight: '700' }]}>
              How to add a DOKO friend
            </Text>
          </View>

          {/* Options List */}
          <View style={styles.optionsContainer}>
            {friendOptions.map((option) => (
              <OptionItem key={option.id} option={option} />
            ))}
          </View>
        </View>
      </View>

      {/* Search Username Modal */}
      <SearchUsernameModal
        visible={showSearchUsernameModal}
        onClose={() => setShowSearchUsernameModal(false)}
        onSelectUser={handleUserSelect}
        onClose1={()=> onClose()}
        onClose2={()=> onClose1()}
         type="friend"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    height: height * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  optionItem: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'System',
    lineHeight: 20,
  },
});

export default AddDokoFriendModal;
