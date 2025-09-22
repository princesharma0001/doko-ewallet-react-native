import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');

const SideDrawer = ({ isOpen, onClose, navigation }) => {
  const { theme } = useTheme();
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [

    { id: 'Dashboard', route: "HomeScreen", label: 'Dashboard', icon: <Ionicons name="grid" size={20} color={theme.colors.text} /> },
    { id: 'Wallet', label: 'Wallet', route: "Wallet", icon: <Ionicons name="wallet" size={20} color={theme.colors.text} /> },
    { id: 'Profile', label: 'Profile', route: "ProfileSection", icon: <Ionicons name="person" size={20} color={theme.colors.text} /> },
    { id: 'Chat', label: 'Chat', route: "NewChat", icon: <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.text} /> },
    { id: 'Community', label: 'Community', route: "CommunitySection", icon: <Ionicons name="people" size={20} color={theme.colors.text} /> },
    { id: 'Transaction', label: 'Transaction', route: "TransactionManagement", icon: <Feather name="repeat" size={20} color={theme.colors.text} /> },
    { id: 'Finance', label: 'Finance', route: "HomeScreen", icon: <Ionicons name="cash" size={20} color={theme.colors.text} /> },
    { id: 'Card', label: 'Card', route: "PhysicalCard", icon: <Ionicons name="card" size={20} color={theme.colors.text} /> },
    { id: 'Notification', label: 'Notification', route: "Notification", icon: <Ionicons name="notifications" size={20} color={theme.colors.text} /> },
    { id: 'Security', label: 'Security', route: "Login", icon: <Ionicons name="shield-checkmark" size={20} color={theme.colors.text} /> },
    { id: 'Setting', label: 'Setting', route: 'Settings', icon: <Ionicons name="settings" size={20} color={theme.colors.text} /> },

  ];

  const handleMenuItemPress = (itemId, route) => {
    setActiveItem(itemId);
    navigation.navigate(route);
    onClose();

    // Navigate to specific screens based on menu item
    // if (itemId === 'Setting' && navigation) {
    //   navigation.navigate('Settings');
    // }
    // if (itemId === 'Wallet' && navigation) {
    //   navigation.navigate('Wallet');
    // }
    // Add more navigation logic for other menu items as needed
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={[styles.backdrop, { backgroundColor: theme.colors.shadow }]} activeOpacity={1} onPress={onClose} />

        {/* Background Image */}
        <View
          style={[styles.drawer, {
            backgroundColor: theme.colors.background,
          }]}
          imageStyle={{
            borderTopRightRadius: 20, borderBottomRightRadius: 20, backgroundColor: theme.colors.background,
          }}
        >
          {/* Sticky Header with Blur */}
          <View style={styles.stickyHeaderWrapper}>
            {Platform.OS === 'ios' ? (
              <BlurView
                style={styles.blurHeader}
                blurType={theme.isDarkMode ? "dark" : "light"}
                blurAmount={20}
                reducedTransparencyFallbackColor={theme.colors.surface}
              />
            ) : (
              <View style={[styles.blurHeader, { backgroundColor: theme.colors.surface }]} />
            )}
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="arrowleft" size={22} color={theme.colors.text} />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  navigation.navigate("Subscription");
                }}
                style={[styles.badge, { backgroundColor: theme.colors.surface }]}
              >
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Standard</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 120, paddingBottom: 40 }}
          >
            <View style={{ alignItems: 'center', paddingBottom: 25 }}>
              <Image
                source={require('../assets/Images/Profile.png')}
                style={styles.avatar}
              />
              <Text style={[styles.userName, {
                fontFamily: theme.typography.fontFamily,
                color: theme.colors.text
              }]}>Devon Lane</Text>
              <View style={styles.userTagContainer}>
                <Text style={[styles.userTag, {
                  fontFamily: theme.typography.fontFamily,
                  color: theme.colors.textSecondary
                }]}>Faizan_231</Text>
                <Ionicons name="qr-code" size={16} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} />
              </View>
            </View>
            <View style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 15,
              marginHorizontal: 15,
              borderRadius: 13,
              paddingVertical: 15
            }}>

              {menuItems.map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      isActive && { backgroundColor: theme.colors.border },
                    ]}
                    onPress={() => handleMenuItemPress(item.id, item?.route)}
                  >
                    <View style={styles.menuContent}>
                      {item.icon}
                      <Text
                        style={[
                          styles.menuLabel,
                          {
                            fontFamily: theme.typography.fontFamily,
                            color: theme.colors.text
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    <AntDesign name="right" size={14} color={theme.colors.text} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20

  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: width,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  stickyHeaderWrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 100,
    zIndex: 10,
  },
  blurHeader: {
    // ...StyleSheet.absoluteFillObject,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userTag: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SideDrawer;
