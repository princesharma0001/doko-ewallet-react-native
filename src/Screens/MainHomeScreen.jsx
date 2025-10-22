import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import CurrentAccount from "../components/CurrentAccount"
import CryptoAccount from "../components/CryptoAccount"
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomBar from '../components/BottomBar';
import SideDrawer from '../components/SideDrawer';
import CommunitySection from '../components/CommunitySection';
import AccountBottomSheet from '../components/AccountBottomSheet';
import HomeScreen from './HomeScreen';
import DAppSection from './DAppSection';
import TransactionManagement from '../components/TransactionManagement';

const { width, height } = Dimensions.get('window');

const MainHomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('current');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleAccountSheet = () => {
    setIsAccountSheetVisible(!isAccountSheetVisible);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account.id);
    setIsAccountSheetVisible(false);
  };

  const getAccountDisplayName = (accountId) => {
    const accountNames = {
      current: t('currentAccount'),
      crypto: t('cryptoAccount'),
      card: t('cardAccount'),
    };
    return accountNames[accountId] || t('cardAccount');
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const renderMainContent = () => {
    // If dApp tab is active, render DAppSection content
    if (activeTab === 'dapp') {
      return <DAppSection navigation={navigation} />;
    }

    if (activeTab === 'apps') {
      return <CommunitySection navigation={navigation} />;
    }
    if (activeTab === 'transfer') {
      return <TransactionManagement navigation={navigation} />;
    }

    // Otherwise render account component based on selected account
    switch (selectedAccount) {
      case 'current':
        return <CurrentAccount navigation={navigation} />;
      // case 'crypto':
      //   return <CryptoAccount />;
      case 'card':
        return <HomeScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.headerContent}>

        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Image
            source={require('../assets/Images/Profile.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {activeTab === 'dapp' || activeTab === "apps" ? (
          <Pressable

            style={[styles.accountSelector, { backgroundColor: theme.colors.surface }]}
          // onPress={toggleAccountSheet}
          >
            <View style={styles.accountInfo}>
              <Text style={[styles.accountText, {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                textAlign: 'center'
              }]}>
{activeTab === "apps" ? t('apps') : t('dAppBrowser')}
              </Text>
            </View>
          </Pressable>
        ) : (
          <TouchableOpacity
            style={[styles.accountSelector, { backgroundColor: theme.colors.surface }]}
            onPress={toggleAccountSheet}
          >
            <View style={styles.accountInfo}>
              <Text style={[styles.accountText, {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                textAlign: 'center'
              }]}>
{activeTab === 'dapp' ? t('dAppBrowser') : getAccountDisplayName(selectedAccount)}

              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.text} style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>)}

        <TouchableOpacity onPress={()=> navigation.navigate("NotificationList")} style={[styles.profileButton, { marginLeft: 16 }]}>
          <Image source={require("../assets/Images/Notificationicons.png")} resizeMode="contain" />
          {/* <View style={[styles.profileIcon, { backgroundColor: '#10B981' }]}>
            <Icon name="person" size={20} color="#fff" />
          </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/Images/BgBack.png")}
      style={{
        flex: 1, backgroundColor: theme.colors.background,
      }}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}

        {renderMainContent()}

        <BottomBar activeTab={activeTab} onTabPress={handleTabPress} />
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          navigation={navigation}
        />
        <AccountBottomSheet
          isVisible={isAccountSheetVisible}
          onClose={() => setIsAccountSheetVisible(false)}
          onSelectAccount={handleAccountSelect}
          selectedAccount={selectedAccount}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 15,
    // paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  menuButton: {
    // padding: 8,
    marginRight: 16,
  },
  menuIcon: {
    width: 45,
    height: 45,
  },
  accountSelector: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationButton: {
    padding: 8,
    marginLeft: 16,
  },
});

export default MainHomeScreen;
