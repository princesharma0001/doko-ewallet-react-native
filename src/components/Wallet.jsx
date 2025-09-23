import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  TouchableHighlight
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomBar from './BottomBar';
import SideDrawer from './SideDrawer';

const { width, height } = Dimensions.get('window');

const Wallet = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedWalletType, setSelectedWalletType] = useState('All');
  const [selectedTransactionFilter, setSelectedTransactionFilter] = useState('All');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const walletTypes = ['All', 'DOKO', 'Fiat', 'Web 3'];
  const [activeTab, setActiveTab] = useState('home');
  const filters = ["All", "Income", "Expenses"];
  const [activeFilter, setActiveFilter] = useState("All");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };


  const transactions = [
    {
      id: 1,
      type: 'send',
      description: 'Sent: UQ....R12F',
      date: '15 July, 2023',
      amount: '- 1.1 BTC',
      status: 'Sended',
    },
    {
      id: 2,
      type: 'send',
      description: 'Sent: UQ....R12F',
      date: '15 July, 2023',
      amount: '- 1.1 BTC',
      status: 'Sended',
    },
    {
      id: 3,
      type: 'send',
      description: 'Sent: UQ....R12F',
      date: '15 July, 2023',
      amount: '- 1.1 BTC',
      status: 'Sended',
    },
    {
      id: 4,
      type: 'send',
      description: 'Sent: UQ....R12F',
      date: '15 July, 2023',
      amount: '- 1.1 BTC',
      status: 'Sended',
    },
  ];

  const activities = [
    {
      id: 1,
      type: "Sent UQ....R12F",
      time: "15 July, 2023",
      amount: "-1.1 BTC Sent",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 2,
      type: "Received Wallet",
      time: "15 July, 2023",
      amount: "+0.5 BTC Received",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 3,
      type: "Payment",
      time: "15 July, 2023",
      amount: "-0.2 BTC Spent",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 4,
      type: "Deposit",
      time: "15 July, 2023",
      amount: "+2.0 BTC Added",
      icon: require("../assets/Images/quick1.png"),
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

        <View style={[styles.accountSelector, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.accountInfo}>
            {/* <View style={[styles.checkmark, { backgroundColor: '#EF4444' }]} /> */}
            <Text style={[styles.accountText, {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              textAlign: 'center'
            }]}>
              My Wallet
            </Text>
            {/* <Text style={[styles.dropdown, { color: colors.muted }]}>▼</Text> */}
          </View>
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <Image source={require("../assets/Images/Profile.png")} resizeMode="contain" />
          {/* <View style={[styles.profileIcon, { backgroundColor: '#10B981' }]}>
              <Icon name="person" size={20} color="#fff" />
            </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );


  const renderWalletTypeTabs = () => (
    <View style={styles.walletTypeContainer}>
      {walletTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.walletTypeTab,
            {
              //  backgroundColor: activeFilter === filter ? theme.colors.primary : theme.colors.border,
              backgroundColor: selectedWalletType === type ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setSelectedWalletType(type)}
        >
          <Text
            style={[
              styles.walletTypeText,
              {
                color: selectedWalletType === type ? theme.colors.primaryText : theme.colors.text,
              },
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCardIcons = () => (
    <View style={styles.cardIconsContainer}>
      <TouchableOpacity style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}>
        <Ionicons name="eye" size={16} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}>
        <Ionicons name="filter" size={16} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}>
        <Ionicons name="refresh" size={16} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}>
        <Ionicons name="add" size={16} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderPrimaryCard = () => (
    <View style={[styles.primaryCard, { flexDirection: 'row', justifyContent: 'center' }]}>
      <Image source={require("../assets/Images/BlueCard.png")} style={{ resizeMode: "contain", }} />
    </View>
  );

  const renderQuickActions = () => (
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
  const MultplerenderQuickActions = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={[styles.actionButton, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }]}>
        <Image source={require("../assets/Images/SendIcon.png")} resizeMode="contain" style={{ width: 40, height: 40 }} />
        {/* <Icon name="send" size={20} color="#fff" /> */}
        <Text style={[styles.actionButtonText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          paddingTop: 8,
          fontSize: 12
        }]}>
          Send
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }]}>
        <Image source={require("../assets/Images/Add.png")} resizeMode="contain" style={{ width: 40, height: 40, tintColor: isDarkMode ? null : 'gray' }} />
        <Text style={[styles.actionButtonText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          paddingTop: 8,
          fontSize: 12
        }]}>
          Receive
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }]}>
        <Image source={require("../assets/Images/QRCode.png")} resizeMode="contain" style={{ width: 40, height: 40, tintColor: isDarkMode ? null : 'gray' }} />
        <Text style={[styles.actionButtonText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          paddingTop: 8,
          fontSize: 12
        }]}>
          QR Code
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }]}>
        <Image source={require("../assets/Images/Exchange.png")} resizeMode="contain" style={{ width: 40, height: 40, tintColor: isDarkMode ? null : 'gray' }} />
        <Text style={[styles.actionButtonText, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          paddingTop: 8,
          fontSize: 12
        }]}>
          Exchange
        </Text>
      </TouchableOpacity>
    </View>


  );

  const renderTotalBalance = () => (
    <View style={styles.totalBalanceContainer}>
      <View style={styles.balanceHeader}>
        <Text style={[styles.balanceLabel, { color: theme.colors.text }]}>Total Balance</Text>
        <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
          <Ionicons
            name={isBalanceVisible ? "eye" : "eye-off"}
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.balanceAmount, {
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
        textAlign: 'center'
      }]}>
        $254,421
        <Text style={{
          fontSize: 25,
          fontFamily: theme.typography.fontFamily,
          color: theme.colors.text
        }}>.00</Text>
      </Text>
      {/* <Text style={[styles.balanceAmount, { color: theme.colors.text,textAlign:'center' }]}>
        {isBalanceVisible ? '$254,421.00' : '••••••••'}
      </Text> */}
    </View>
  );

  const renderTransactionFilters = () => (
    <View style={[styles.card, {
      backgroundColor: theme.colors.surface,
      paddingTop: 18,
    }]}>
      {/* <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: '700' }]}>
           Recent Activity
         </Text> */}

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





  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}
      >
        {renderWalletTypeTabs()}
        <View style={{ backgroundColor: theme.colors.surface, borderRadius: 20, marginBottom: 25 }}>

          {renderCardIcons()}
          {renderPrimaryCard()}
        </View>
        {renderQuickActions()}
        {renderTotalBalance()}
        {MultplerenderQuickActions()}
        {/* {renderQuickActions()} */}
        {renderTransactionFilters()}
      </ScrollView>
      {/* <BottomBar activeTab={activeTab} onTabPress={handleTabPress} /> */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        navigation={navigation}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  },
  header: {
    paddingTop: 10,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  hamburger: {
    width: 45,
    height: 45,
    borderRadius: 3,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
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
  accountSelector: {
    flex: 1,
    marginHorizontal: 10,
    marginLeft:14,
    borderRadius: 20,
    // borderWidth: 1,
    padding: 12,
  },
  profileButton: {
    padding: 8,
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
  hamburgerLine: {
    height: 2,
    borderRadius: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom:140
  },

  accountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  walletTypeContainer: {
    flexDirection: 'row',
    // paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
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
  walletTypeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  walletTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardIconsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    marginBottom: 16,
    paddingTop: 18,
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCard: {
    // marginHorizontal: 20,
    // borderRadius: 16,
    // padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 0.5,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardBalance: {
    fontSize: 14,
    opacity: 0.8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    padding: 4,
  },
  visaLogo: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  visaText: {
    fontSize: 16,
    fontWeight: '700',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalBalanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 10
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '700',
  },
  transactionFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  transactionFilterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  transactionFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
  },
  transactionAmount: {
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
  scrollView: {
    flex: 1,
    paddingTop: 20
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
  },
  bottomNavIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bottomNavHomeIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  bottomNavLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Wallet;
