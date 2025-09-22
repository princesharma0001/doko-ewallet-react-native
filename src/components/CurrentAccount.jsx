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
  TouchableHighlight,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../context/ThemeContext';



const CurrentAccount = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);

  // Debug modal state
  React.useEffect(() => {
    console.log('Modal visibility changed:', isSendModalVisible);
  }, [isSendModalVisible]);

  // Handler functions
  const handleSendPress = () => {
    console.log('Send button pressed!');
    setIsSendModalVisible(true);
  };

  const handleSendOption = (option) => {
    setIsSendModalVisible(false);
    Alert.alert(
      'Send Option Selected',
      `You selected: ${option}`,
      [{ text: 'OK' }]
    );
  };

  const activities = [
    {
      id: 1,
      type: "Send UQ....R12F",
      time: "07:36 AM",
      amount: "-1.1 BTC",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 2,
      type: "Received Wallet",
      time: "10:12 AM",
      amount: "+0.5 BTC",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 3,
      type: "Deposit: EQ...lf98",
      time: "01:45 PM",
      amount: "-0.2 BTC",
      icon: require("../assets/Images/quick1.png"),
    },
    {
      id: 4,
      type: "Burger King",
      time: "04:30 PM",
      amount: "+2.0 BTC",
      icon: require("../assets/Images/quick1.png"),
    },
  ];


  const renderBalanceSection = () => (
    <View style={[styles.balanceSection, {}]}>
      <View style={styles.balanceHeader}>
        <Text style={[styles.balanceLabel, {
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          fontWeight: "700"
        }]}>
          Your balance
        </Text>

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


    </View>
  );

  const renderActionButtons = () => (
    <View style={[styles.actionButtons, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Send (Active) */}
      <TouchableOpacity style={styles.actionButton} onPress={handleSendPress}>
        {/* <View style={[styles.iconWrapper, styles.activeIcon]}> */}
        <View style={{ paddingBottom: 10 }}>

          <Image
            source={require("../assets/Images/SendIcon.png")}
            resizeMode="contain"
            style={[styles.iconImage, { tintColor: isDarkMode ? null : 'gray' }]}
          />
        </View>
        {/* </View> */}
        <Text style={[styles.actionText, styles.activeText, { color: theme.colors.text }]}>Send</Text>
      </TouchableOpacity>

      {/* Deposit */}
      <TouchableOpacity onPress={() => navigation.navigate('CreditCard')} style={styles.actionButton}>
        {/* <View style={styles.iconWrapper}> */}
        <View style={{ paddingBottom: 10 }}>

          <Image
            source={require("../assets/Images/Add.png")}
            resizeMode="contain"
            style={[styles.iconImage, { tintColor: isDarkMode ? null : 'gray' }]}
          />
        </View>
        {/* </View> */}
        <Text style={[styles.actionText, styles.activeText, { color: theme.colors.text }]}>Deposit</Text>

      </TouchableOpacity>

      {/* Invest */}
      <TouchableOpacity style={styles.actionButton}>
        {/* <View style={styles.iconWrapper}> */}
        <View style={{ paddingBottom: 10 }}>

          <Image
            source={require("../assets/Images/Invest.png")}
            resizeMode="contain"
            style={[styles.iconImage, { tintColor: isDarkMode ? null : 'gray' }]}
          />
        </View>
        {/* </View> */}
        <Text style={[styles.actionText, styles.activeText, { color: theme.colors.text }]}>Invest</Text>

      </TouchableOpacity>

      {/* + Add Card (side tab) */}
      <View style={styles.addCardButton}>
        <Text style={styles.addCardText} numberOfLines={1} ellipsizeMode="clip">
          + Add Card
        </Text>
      </View>
    </View>
  );





  const renderLatestTransactions = () => (
    <View style={[styles.transactionsContainer, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.transactionsTitle, { color: theme.colors.text }]}>
        Latest Transactions
      </Text>
      {activities.map((item) => (
        <TouchableHighlight key={item.id} style={styles.activityItem}
          onPress={() => navigation.navigate('CurrentHistory')}

          underlayColor={theme.colors.border} // softer highlight for dark theme
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
                  color: item.amount.startsWith("+") ? theme.colors.text : theme.colors.text, // income green / expense red
                  fontFamily: theme.typography.fontFamily,
                  fontWeight: "700"
                },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        </TouchableHighlight>
      ))}
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
        {renderLatestTransactions()}

        {/* Bottom padding for BottomBar */}
        <View style={{ height: 100 }} />

        {/* Temporary Test Button */}

      </ScrollView>

      {/* Send Options Modal */}
      <Modal
        visible={isSendModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSendModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)' }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => {
              console.log('Modal overlay pressed');
              setIsSendModalVisible(false);
            }}
          />
          <View style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.surface,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              shadowColor: isDarkMode ? '#000' : '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }
          ]}>
            {/* Debug Text */}


            {/* Grabber Handle */}
            <View style={[styles.modalGrabber, { backgroundColor: theme.colors.border }]} />

            {/* Send Options */}
            <View style={styles.sendOptionsContainer}>
              {/* Send to DOKO User */}
              <TouchableOpacity
                style={[styles.sendOption, { backgroundColor: theme.colors.border }]}
                onPress={() => handleSendOption('Send to DOKO User')}
                activeOpacity={0.7}
              >
                <View style={styles.sendOptionIcon}>
                  <Image source={require("../assets/Images/R.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />
                </View>
                <Text style={[styles.sendOptionText, { color: theme.colors.text }]}>Send to DOKO User</Text>
              </TouchableOpacity>

              {/* Send Money Internationally */}
              <TouchableOpacity
                style={[styles.sendOption, { backgroundColor: theme.colors.card }]}
               onPress={() => {
                  setIsSendModalVisible(false);
                  navigation.navigate("SendInternational");
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.sendOptionIcon, styles.internationalIcon]}>
                  <Image source={require("../assets/Images/SendMoney.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />
                </View>
                <Text style={[styles.sendOptionText, { color: theme.colors.text }]}>Send Money Internationally</Text>

              </TouchableOpacity>

              {/* Send Via Bank Transfer */}
              <TouchableOpacity
                style={[styles.sendOption, { backgroundColor: theme.colors.card }]}
                onPress={() => {
                  setIsSendModalVisible(false);
                  navigation.navigate("BankTransfer");
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.sendOptionIcon, styles.bankIcon]}>
                  <Image source={require("../assets/Images/BankICons.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />
                </View>
                <Text style={[styles.sendOptionText, { color: theme.colors.text }]}>Send Via Bank Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  activeText: {
    // color: "#1AA5FF",
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#363443",
    borderRadius: 20,
    marginHorizontal: 30,
    // marginBottom: 20,
    borderWidth: 0.9,
    borderColor: "#3C3C56"

  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  // actionButton: {
  //   flex: 1,
  //   alignItems: 'center',
  //   paddingVertical: 16,
  //   borderRadius: 12,
  //   marginRight: 12,
  // },
  activeIcon: {
    borderWidth: 1.5,
    borderColor: "#1AA5FF",
    backgroundColor: "#2B2E3A",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#3A3D4A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  // actionText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  // },
  actionText: {
    fontSize: 13,
    // color: "#FFFFFF",
    fontWeight: "500",
  },
  addCardButton: {
    backgroundColor: "#26242f",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 38,
    width: 35,
    // paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    marginRight: -19

  },
  addCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    transform: [{ rotate: "-90deg" }],
    // <-- when used directly on <Text>
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

  transactionsContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: -25,
    zIndex: -11111
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 28
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    minHeight: 200,
    maxHeight: '50%',
  },
  modalGrabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sendOptionsContainer: {
    gap: 16,
  },
  sendOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sendOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#1AA5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sendOptionIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  internationalIcon: {
    // backgroundColor: '#6B7280',
  },
  bankIcon: {
    backgroundColor: '#6B7280',
  },
  sendOptionText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    backgroundColor: '#6B22E7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CurrentAccount;

