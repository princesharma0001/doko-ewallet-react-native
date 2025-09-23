import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
  Image,
  TouchableHighlight,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import BottomBar from '../components/BottomBar';
import SideDrawer from '../components/SideDrawer';
import AccountBottomSheet from '../components/AccountBottomSheet';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {

  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('card');
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'currentAccount'
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Income", "Expenses"];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleAccountSheet = () => {
    setIsAccountSheetVisible(!isAccountSheetVisible);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account.id);
    if (account.id === 'current') {
      setCurrentView('currentAccount');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const getAccountDisplayName = (accountId) => {
    const accountNames = {
      current: 'Current Account',
      crypto: 'Crypto Account',
      card: 'Card Account',
    };
    return accountNames[accountId] || 'Card Account';
  };

  const activities = [
    {
      id: 1,
      type: "Sent UQ....R12F",
      time: "07:36 AM",
      amount: "-1.1 BTC Sent",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 2,
      type: "Received Wallet",
      time: "10:12 AM",
      amount: "+0.5 BTC Received",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 3,
      type: "Payment",
      time: "01:45 PM",
      amount: "-0.2 BTC Spent",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 4,
      type: "Deposit",
      time: "04:30 PM",
      amount: "+2.0 BTC Added",
      icon: require("../assets/Images/quick1.png"),
    },
  ];

  const contacts = [
    {
      id: 1,
      type: "Alex Johnson",
      time: "@alex.api",
      amount: "-1.1 BTC Sent",
      icon: require("../assets/Images/RedFlag.png"),
    },
    {
      id: 2,
      type: "Alex Johnson",

      time: "@alex.api",

      amount: "+0.5 BTC Received",
      icon: require("../assets/Images/RedFlag.png"),
    },
    {
      id: 3,
      type: "Alex Johnson",
      time: "@alex.api",

      amount: "-0.2 BTC Spent",
      icon: require("../assets/Images/RedFlag.png"),
    },

  ];

  const Cards = [
    {
      id: 1,
      type: "Balance",
      time: "**** **** **** 4582",
      amount: "$1232223,32",
      icon: require("../assets/Images/YellowCard.png"),
    },
    {
      id: 2,
      type: "Balance",
      time: "**** **** **** 4582",
      amount: "$1232223,32",
      icon: require("../assets/Images/YellowCard.png"),
    },


  ];


  const renderHeader = () => (
    <View style={[styles.header, {}]}>
      <StatusBar
        barStyle={theme.isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />


      {/* Main Header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <View style={[styles.hamburger, { backgroundColor: theme.colors.surface, borderRadius: 50 }]}>
            <Feather name="menu" size={20} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.accountSelector, { backgroundColor: theme.colors.surface }]}
          onPress={toggleAccountSheet}
        >
          <View style={styles.accountInfo}>
            {/* <View style={[styles.checkmark, { backgroundColor: '#EF4444' }]} /> */}
            <Text style={[styles.accountText, {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              textAlign: 'center'
            }]}>
              {getAccountDisplayName(selectedAccount)}  <Image source={require("../assets/Images/RedIcon.png")} style={{ resizeMode: 'contain' }} />
            </Text>

            {/* <AntDesign name="arrow-down" size={16} color={theme.colors.text} style={{ marginLeft: 8 }} /> */}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Image source={require("../assets/Images/Profile.png")} resizeMode="contain" />
          {/* <View style={[styles.profileIcon, { backgroundColor: '#10B981' }]}>
            <Icon name="person" size={20} color="#fff" />
          </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBalanceSection = () => (
    <View style={[styles.balanceSection, {}]}>
      <View style={styles.balanceHeader}>
        <Text style={[styles.balanceLabel, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          fontWeight: "700"
        }]}>
          Total Balance
        </Text>
        <TouchableOpacity>
          <Icon name="eye" size={16} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.balanceAmount, {
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily
      }]}>
        $254,421
        <Text style={{
          fontSize: 25,
          fontFamily: theme.typography.fontFamily,
          color: theme.colors.text
        }}>.00</Text>
      </Text>

      <Text style={[styles.balanceChange, {
        color: theme.colors.success,
        fontFamily: theme.typography.fontFamily
      }]}>
        +2.5% from last week
      </Text>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={[styles.actionButton, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }]}>
        <Image source={require("../assets/Images/SendIcon.png")} resizeMode="contain" style={{ width: 45, height: 45 }} />
        {/* <Icon name="send" size={20} color="#fff" /> */}
        <Text style={[styles.actionButtonText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          paddingTop: 8
        }]}>
          Send
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }]}>
        <Image source={require("../assets/Images/RecieveIcon.png")} resizeMode="contain" style={{ width: 45, height: 45, tintColor: isDarkMode ? null : 'gray' }} />
        <Text style={[styles.actionButtonText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          paddingTop: 8
        }]}>
          Receive
        </Text>
      </TouchableOpacity>
    </View>
  );

  const StatItem = ({ icon, label, value, onPress }) => (
    <TouchableHighlight
      style={styles.statItem}
      onPress={onPress}
      underlayColor={theme.colors.border} // softer highlight for dark theme
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.statIcon}>
          <Image source={icon} resizeMode="contain" style={{ width: 32, height: 32 }} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statLabel, { color: theme.colors.text, fontFamily: theme.typography.fontFamily }]}>
            {label}
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.text, fontFamily: theme.typography.fontFamily }]}>
            {value}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  


  const renderQuickStats = () => {
    const stats = [
      { label: "Sent: UQ....R12F", value: "$3,428.20", onPress: () => console.log("Send pressed") },
      { label: "Expenses", value: "$1,694.80", onPress: () => console.log("Expenses pressed") },
      { label: "Wallets", value: "3", onPress: () => console.log("Wallets pressed") },
    ];

    return (
      <View style={[styles.card, {
        backgroundColor: theme.colors.surface,
        paddingVertical: 18,
        paddingTop: 22
      }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, paddingBottom: 6, fontWeight: "700" }]}>
          Quick Stats
        </Text>

        {stats.map((item, index) => (
          <StatItem
            key={index}
            icon={require("../assets/Images/quick.png")}
            label={item.label}
            value={item.value}
            onPress={item.onPress}
          />
        ))}
      </View>
    );
  };

  const renderRecentActivity = () => (
    <View style={[styles.card, {
      backgroundColor: theme.colors.surface,
      paddingTop: 18
    }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: '700' }]}>
        Recent Activity
      </Text>

      <View style={styles.filterButtons}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === filter ? theme.colors.primary : theme.colors.border,
                paddingHorizontal: filter === "All" ? 35 : filter === "Income" ? 30 : 20,
              },
            ]}
            onPress={() => setActiveFilter(filter)}

          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: activeFilter === filter ? "#fff" : theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activities.map((item) => (
        <TouchableHighlight key={item.id} style={styles.activityItem} onPress={() => console.log("f")
        } underlayColor={theme.colors.border} // softer highlight for dark theme
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.activityIcon}>
              <Image source={item.icon} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityType, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: "600" }]}>
                {item.type}
              </Text>
              <Text style={[styles.activityTime, {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily
              }]}>
                {item.time}
              </Text>
            </View>
            <Text
              style={[
                styles.activityAmount,
                {
                  color: item.amount.startsWith("+") ? theme.colors.success : theme.colors.error, // income green / expense red
                  fontFamily: theme.typography.fontFamily,
                },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        </TouchableHighlight>
      ))}


      <TouchableOpacity style={[styles.seeAllButton, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.seeAllText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily
        }]}>
          See all
        </Text>
        <AntDesign name="right" size={20} color={theme.colors.text} />

      </TouchableOpacity>
    </View>
  );

  const renderMyWallet = () => {

    return (
      <View style={[styles.card, {
        backgroundColor: theme.colors.surface,
        padding: 18,
        borderRadius: 16
      }]}>
        {/* Title */}
        <Text
          style={[
            styles.cardTitle,
            { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: "700", marginBottom: 15 },
          ]}
        >
          My Wallet
        </Text>

        {/* Cards */}
        {Cards.map((item) => (
          <TouchableHighlight
            key={item.id}
            style={{ paddingVertical: 12 }}
            underlayColor={"transparent"}
            onPress={() => navigation.navigate("PhysicalCard")}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              {/* Left: Card Icon + Balance */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Image source={item.icon} resizeMode="contain" style={{ width: 60, height: 50, borderRadius: 8 }} />
                <View>
                  <Text style={{ color: theme.colors.text, fontWeight: "600", fontFamily: theme.typography.fontFamily }}>Balance</Text>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 18,
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: "800",
                      paddingTop: 5
                    }}
                  >
                    {item.amount}
                  </Text>
                </View>
              </View>

              {/* Right: Masked Number */}
              <Text style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily
              }}>{item.time}</Text>
            </View>
          </TouchableHighlight>
        ))}

        {/* Divider */}
        <View style={{
          height: 1,
          backgroundColor: theme.colors.border,
          marginVertical: 10
        }} />

        {/* Manage Wallet Button */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.surface,
            padding: 5,
            borderRadius: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image source={require("../assets/Images/grupCard.png")} resizeMode="contain" style={{ width: 50, height: 40 }} />
            <View>
              <Text style={{
                color: theme.colors.text,
                fontWeight: "700",
                fontFamily: theme.typography.fontFamily,
                fontSize: 16
              }}>Manage All Wallet</Text>
              <Text style={{
                color: theme.colors.textSecondary,
                fontSize: 12,
                fontFamily: theme.typography.fontFamily,
                paddingTop: 5,
                fontWeight: "500"
              }}>
                Select Physical or Virtual
              </Text>
            </View>
          </View>
          <AntDesign name="right" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMyContacts = () => (
    <View style={[styles.card, {
      backgroundColor: theme.colors.surface,
      paddingTop: 18
    }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: '700' }]}>
        My Contact
      </Text>



      {contacts.map((item) => (
        <TouchableHighlight key={item.id} style={styles.activityItem} onPress={() => console.log("f")
        } underlayColor={theme.colors.border} // softer highlight for dark theme
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.activityIcon}>
              <Image source={item.icon} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityType, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: "600" }]}>
                {item.type}
              </Text>
              <Text style={[styles.activityTime, {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily
              }]}>
                {item.time}
              </Text>
            </View>

          </View>
        </TouchableHighlight>
      ))}


      <TouchableOpacity style={[styles.seeAllButton, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.seeAllText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily
        }]}>
          View All Contact
        </Text>
        <AntDesign name="right" size={20} color={theme.colors.text} />

      </TouchableOpacity>
    </View>
  );


  return (
    <>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderBalanceSection()}
        {renderActionButtons()}
        {renderQuickStats()}
        {renderRecentActivity()}
        {renderMyWallet()}
        {renderMyContacts()}

        {/* Bottom padding for BottomBar */}
        <View style={{ height: 100, }} />
      </ScrollView>


      {/* <BottomBar activeTab={activeTab} onTabPress={handleTabPress} /> */}
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
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalIcon: {
    width: 18,
    height: 12,
    borderRadius: 2,
  },
  wifiIcon: {
    width: 16,
    height: 12,
    borderRadius: 2,
  },
  batteryIcon: {
    width: 24,
    height: 12,
    borderRadius: 2,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuButton: {
    // padding: 8,
  },
  hamburger: {
    width: 45,
    height: 45,
    borderRadius: 3,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLine: {
    height: 2,
    borderRadius: 1,
  },
  accountSelector: {
    flex: 1,
    marginHorizontal: 15,
    borderRadius: 20,
    // borderWidth: 1,
    padding: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  accountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  dropdown: {
    fontSize: 12,
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 52,
    fontWeight: '700',
    marginBottom: 5,
  },
  balanceChange: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 5
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    height: 108,
    borderWidth: 0.5,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    // borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 13
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '700'
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 13
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityId: {
    fontSize: 12,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  seeAllButton: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#282831',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  walletCards: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  walletCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  walletCardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  walletCardNumber: {
    fontSize: 12,
    opacity: 0.8,
  },
  walletBalance: {
    alignItems: 'center',
    marginBottom: 15,
  },
  walletBalanceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  manageWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  manageWalletIcon: {
    marginRight: 12,
  },
  manageWalletText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactUsername: {
    fontSize: 12,
  },
  viewAllContactsButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllContactsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Current Account specific styles
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addCardButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '600',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
  },
  transactionsContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionTime: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
  },
});

export default HomeScreen;
