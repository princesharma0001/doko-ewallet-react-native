import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const BottomBar = ({ activeTab, onTabPress }) => {
  const { theme, isDarkMode } = useTheme();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      iconFamily: 'Ionicons',
    },
    {
      id: 'dapp',
      label: 'dApp',
      icon: 'globe',
      iconFamily: 'Ionicons',
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: 'swap-horizontal',
      iconFamily: 'MaterialCommunityIcons',
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: 'apps',
      iconFamily: 'Ionicons',
    },
  ];

  const renderIcon = (tab) => {
    const iconColor = activeTab === tab.id ? '#1DAFFF' : "#9E9E9E";
    const iconSize = 24;

    if (tab.id === 'home') {
      return (
        <View style={[
          styles.iconContainer,
          activeTab === tab.id && styles.activeIconContainer
        ]}>
          <Image source={require("../assets/Images/HOMED.png")} style={{ width: 26, height: 26, resizeMode: 'contain' }} />
        </View>
      );
    }

    // Render different icon families
    switch (tab.iconFamily) {
      case 'Ionicons':
        return <Icon name={tab.icon} size={30} color={iconColor} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={tab.icon} size={32} color={iconColor} />;
      case 'AntDesign':
        return <AntDesign name={tab.icon} size={iconSize} color={iconColor} />;
      default:
        return <Icon name={tab.icon} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#464665' : theme.colors.border }]}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            {renderIcon(tab)}
            <Text style={[
              styles.label,
              {
                color: activeTab === tab.id ? '#1DAFFF' : "#9E9E9E",
                fontFamily: theme.typography.fontFamily,
                // fontSize: theme.typography.sizes.sm,
              }
            ]}>
              {tab.label}
            </Text>

          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area for home indicator
    paddingTop: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  iconContainer: {
    // width: 32,
    // height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  homeIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    // marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 8,
  },
});

export default BottomBar;
