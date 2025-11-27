import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  TouchableHighlight,
  Modal,
  Clipboard,
  Alert,
  Animated,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BottomBar from "./BottomBar";
import SideDrawer from "./SideDrawer";
import { useLanguage } from "../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../store";
import CurrentAccount from "./CurrentAccount";
import QRCode from "react-native-qrcode-svg";
import { getWalletList } from "../store/slices/walletSlice";

const { width, height } = Dimensions.get("window");

const Wallet = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedWalletType, setSelectedWalletType] = useState("All");
  const [selectedTransactionFilter, setSelectedTransactionFilter] =
    useState("All");
  const qrCodeRef = useRef(null);
  const pulse = useRef(new Animated.Value(0.6)).current;
  const [walletAddress, setWalletAddress] = useState("");

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const { t } = useLanguage();
  const { currentUser, isProfileLoading, profileError } = useAppSelector(
    (state) => state.user
  );
  const {
    walletList,
    isWalletListLoading,
    walletListError,
  } = useAppSelector((state) => state.wallet);
  const walletTypes = ["All", "DOKO", "Fiat", "Web 3"];
  const [activeTab, setActiveTab] = useState("home");
  const filters = ["All", "Income", "Expenses"];
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!walletList || walletList.length === 0) {
      dispatch(getWalletList());
    }
  }, [dispatch, walletList?.length]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [pulse]);

  const usdcWallet = useMemo(
    () =>
      walletList?.find(
        (wallet) => wallet?.currency?.toUpperCase() === "USDC"
      ),
    [walletList]
  );

  useEffect(() => {
    if (usdcWallet) {
      const derivedAddress =
        usdcWallet.walletAddress ||
        usdcWallet.address ||
        usdcWallet.publicKey ||
        usdcWallet.id ||
        usdcWallet._id ||
        usdcWallet.name ||
        "USDC Wallet";
      setWalletAddress(derivedAddress);
    }
  }, [usdcWallet]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSendPress = () => {
    setIsSendModalVisible(true);

    console.log("Send button pressed!");
    if (currentUser.kycStatus === "APPROVED") {
      // setShowLogoutModal(true);
      setIsSendModalVisible(true);
    } else {
      // setShowLogoutModal(true);
    }
  };

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
          <View
            style={[
              styles.hamburger,
              { backgroundColor: theme.colors.surface, borderRadius: 50 },
            ]}
          >
            <Feather name="menu" size={20} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        <View
          style={[
            styles.accountSelector,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.accountInfo}>
            {/* <View style={[styles.checkmark, { backgroundColor: '#EF4444' }]} /> */}
            <Text
              style={[
                styles.accountText,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  textAlign: "center",
                },
              ]}
            >
              My Wallet
            </Text>
            {/* <Text style={[styles.dropdown, { color: colors.muted }]}>▼</Text> */}
          </View>
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={require("../assets/Images/Profile.png")}
            resizeMode="contain"
          />
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
              backgroundColor:
                selectedWalletType === type
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}
          onPress={() => setSelectedWalletType(type)}
        >
          <Text
            style={[
              styles.walletTypeText,
              {
                color:
                  selectedWalletType === type
                    ? theme.colors.primaryText
                    : theme.colors.text,
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
      <TouchableOpacity
        style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}
      >
        <Ionicons name="eye" size={16} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}
      >
        <Ionicons name="filter" size={16} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}
      >
        <Ionicons name="refresh" size={16} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cardIcon, { backgroundColor: theme.colors.ActiceIcon }]}
      >
        <Ionicons name="add" size={16} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderPrimaryCard = () => (
    <View
      style={[
        styles.primaryCard,
        { flexDirection: "row", justifyContent: "center" },
      ]}
    >
      <Image
        source={require("../assets/Images/BlueCard.png")}
        style={{ resizeMode: "contain" }}
      />
    </View>
  );

  const renderComingSoon = () => (
    <View style={styles.comingSoonContainer}>
      <Text
        style={[
          styles.comingSoonText,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
          },
        ]}
      >
        Coming Soon
      </Text>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={handleSendPress}
      >
        <Image
          source={require("../assets/Images/SendIcon.png")}
          resizeMode="contain"
          style={{ width: 45, height: 45 }}
        />
        {/* <Icon name="send" size={20} color="#fff" /> */}
        <Text
          style={[
            styles.actionButtonText,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              paddingTop: 8,
            },
          ]}
        >
          Send
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Image
          source={require("../assets/Images/RecieveIcon.png")}
          resizeMode="contain"
          style={{
            width: 45,
            height: 45,
            tintColor: isDarkMode ? null : "gray",
          }}
        />
        <Text
          style={[
            styles.actionButtonText,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              paddingTop: 8,
            },
          ]}
        >
          Receive
        </Text>
      </TouchableOpacity>
    </View>
  );
  const copyWalletAddress = async (addressToCopy) => {
    try {
      await Clipboard.setString(addressToCopy || walletAddress || "USDC Wallet");
      Alert.alert("Copied", "Wallet address copied to clipboard");
    } catch (error) {
      Alert.alert("Error", "Failed to copy wallet address");
    }
  };

  const renderWeb3Skeleton = () => (
    <View style={styles.web3Container}>
      <View style={styles.web3BalanceRow}>
        <Animated.View
          style={[
            styles.web3SkeletonLine,
            {
              width: 120,
              height:20,
              opacity: pulse,
              backgroundColor: theme.colors.border || "rgba(255,255,255,0.2)",
            },
          ]}
        />
        <Animated.View
          style={[
            styles.web3SkeletonLine,
            {
              width: 90,
              height:20,
              opacity: pulse,
              backgroundColor: theme.colors.border || "rgba(255,255,255,0.2)",
            },
          ]}
        />
      </View>
      <View style={styles.qrCodeWrapper}>
        <Animated.View
          style={[
            styles.qrSkeletonBox,
            {
              opacity: pulse,
              backgroundColor:
                theme.colors.border || "rgba(255, 255, 255, 0.15)",
            },
          ]}
        />
      </View>
      <View style={styles.walletAddressContainer}>
        <Animated.View
          style={[
            styles.addressSkeletonBox,
            {
              opacity: pulse,
              backgroundColor:
                theme.colors.border || "rgba(255, 255, 255, 0.15)",
            },
          ]}
        />
      </View>
    </View>
  );

  const renderQuickQRCode = (address, balance, currency) => (
    <View style={styles.web3Container}>
      <View style={styles.web3BalanceRow}>
        <Text
          style={[
            styles.web3BalanceLabel,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily,
            },
          ]}
        >
          USDC Balance
        </Text>
        <Text
          style={[
            styles.web3BalanceValue,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
            },
          ]}
        >
          {`${Number(balance ?? 0).toFixed(2)} ${currency || "USDC"}`}
        </Text>
      </View>
      <View style={styles.qrCodeWrapper}>
        <View
          style={[
            styles.qrCodeContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <QRCode
            ref={qrCodeRef}
            value={address || "USDC"}
            size={250}
            color={theme.colors.text}
            backgroundColor={theme.colors.surface}
          />
        </View>
      </View>
      <View style={styles.walletAddressContainer}>
        <View
          style={[
            styles.walletAddressBox,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.walletAddressText,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {address || walletAddress || "USDC Wallet"}
          </Text>
          <TouchableOpacity
            onPress={() => copyWalletAddress(address)}
            style={styles.copyButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="copy-outline"
              size={20}
              color={theme.colors.primary || "#169BFF"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const renderWeb3Section = () => {
    if (isWalletListLoading) {
      return renderWeb3Skeleton();
    }



    if (!usdcWallet) {
      return (
        <View style={styles.web3StatusContainer}>
          <Text
            style={[
              styles.web3StatusText,
              { color: theme.colors.textSecondary },
            ]}
          >
            {t("noUsdcWalletFound") || "No USDC wallet found."}
          </Text>
        </View>
      );
    }

    return (
      <>
        {renderQuickQRCode(walletAddress, usdcWallet.balance, usdcWallet.currency)}
        {renderTransactionFilters()}
      </>
    );
  };

  const MultplerenderQuickActions = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Image
          source={require("../assets/Images/SendIcon.png")}
          resizeMode="contain"
          style={[styles.iconImage, { tintColor: isDarkMode ? null : "gray" }]}
        />
        {/* <Image source={require("../assets/Images/SendIcon.png")} resizeMode="contain" style={{ width: 40, height: 40 }} /> */}
        {/* <Icon name="send" size={20} color="#fff" /> */}
        <Text
          style={[
            styles.actionButtonText,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              paddingTop: 8,
              fontSize: 12,
            },
          ]}
        >
          Send
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Image
          source={require("../assets/Images/Add.png")}
          resizeMode="contain"
          style={{
            width: 40,
            height: 40,
            tintColor: isDarkMode ? null : "gray",
          }}
        />
        <Text
          style={[
            styles.actionButtonText,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              paddingTop: 8,
              fontSize: 12,
            },
          ]}
        >
          Receive
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Image
          source={require("../assets/Images/QRCode.png")}
          resizeMode="contain"
          style={{
            width: 40,
            height: 40,
            tintColor: isDarkMode ? null : "gray",
          }}
        />
        <Text
          style={[
            styles.actionButtonText,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              paddingTop: 8,
              fontSize: 12,
            },
          ]}
        >
          QR Code
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.actionButton, {
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
      </TouchableOpacity> */}
    </View>
  );

  const renderTotalBalance = () => (
    <View style={styles.totalBalanceContainer}>
      <View style={styles.balanceHeader}>
        <Text style={[styles.balanceLabel, { color: theme.colors.text }]}>
          Total Balance
        </Text>
        <TouchableOpacity
          onPress={() => setIsBalanceVisible(!isBalanceVisible)}
        >
          <Ionicons
            name={isBalanceVisible ? "eye" : "eye-off"}
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.balanceAmount,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            textAlign: "center",
          },
        ]}
      >
        $254,421
        <Text
          style={{
            fontSize: 25,
            fontFamily: theme.typography.fontFamily,
            color: theme.colors.text,
          }}
        >
          .00
        </Text>
      </Text>
      {/* <Text style={[styles.balanceAmount, { color: theme.colors.text,textAlign:'center' }]}>
        {isBalanceVisible ? '$254,421.00' : '••••••••'}
      </Text> */}
    </View>
  );

  const renderTransactionFilters = () => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          paddingTop: 18,
          marginHorizontal:20
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily, fontWeight: '700' }]}>
           Recent transaction
         </Text>

      <View style={styles.filterButtons}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === filter
                    ? theme.colors.primary
                    : theme.colors.border,
                paddingHorizontal:
                  filter === "All" ? 35 : filter === "Income" ? 30 : 20,
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
        <TouchableHighlight
          key={item.id}
          style={styles.activityItem}
          onPress={() => console.log("f")}
          underlayColor={theme.colors.border} // softer highlight for dark theme
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.activityIcon}>
              <Image
                source={item.icon}
                resizeMode="contain"
                style={{ width: 40, height: 40 }}
              />
            </View>
            <View style={styles.activityContent}>
              <Text
                style={[
                  styles.activityType,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: "600",
                  },
                ]}
              >
                {item.type}
              </Text>
              <Text
                style={[
                  styles.activityTime,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily,
                  },
                ]}
              >
                {item.time}
              </Text>
            </View>
            <Text
              style={[
                styles.activityAmount,
                {
                  color: item.amount.startsWith("+")
                    ? theme.colors.success
                    : theme.colors.error, // income green / expense red
                  fontFamily: theme.typography.fontFamily,
                },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        </TouchableHighlight>
      ))}

      <TouchableOpacity
        style={[styles.seeAllButton, { backgroundColor: theme.colors.border }]}
      >
        <Text
          style={[
            styles.seeAllText,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
            },
          ]}
        >
          See all
        </Text>
        <AntDesign name="right" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderWalletTypeTabs()}
        {selectedWalletType === "All" ? (
          <>
            <CurrentAccount navigation={navigation} />
          </>
        ) : selectedWalletType === "DOKO" || selectedWalletType === "Fiat" ? (
          renderComingSoon()
        ) : selectedWalletType === "Web 3" ? (
          renderWeb3Section()
        ) : (
          renderQuickActions()
        )}

        {/* {renderCardIcons()} */}
        {/* {renderPrimaryCard()} */}

        {/* {renderQuickActions()} */}
        {/* {renderTotalBalance()} */}
        {/* {MultplerenderQuickActions()} */}
        {/* {renderQuickActions()} */}
        {/* {renderTransactionFilters()} */}
      </ScrollView>
      <Modal
        visible={isSendModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSendModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDarkMode
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(0, 0, 0, 0.3)",
            },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => {
              console.log("Modal overlay pressed");
              setIsSendModalVisible(false);
            }}
          />
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.colors.surface,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                shadowColor: isDarkMode ? "#000" : "#000",
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: isDarkMode ? 0.3 : 0.1,
                shadowRadius: 3.84,
                elevation: 5,
              },
            ]}
          >
            {/* Debug Text */}

            {/* Grabber Handle */}
            <View
              style={[
                styles.modalGrabber,
                { backgroundColor: theme.colors.border },
              ]}
            />

            {/* Send Options */}
            <View style={styles.sendOptionsContainer}>
              {/* Send to DOKO User */}
              <TouchableOpacity
                onPress={() => {
                  setIsSendModalVisible(false);
                  // setShowSearchUsernameModal(true);
                }}
                style={[
                  styles.sendOption,
                  { backgroundColor: theme.colors.border },
                ]}
                // onPress={() => handleSendOption('Send to DOKO User')}
                activeOpacity={0.7}
              >
                <View style={styles.sendOptionIcon}>
                  <Image
                    source={require("../assets/Images/R.png")}
                    resizeMode="contain"
                    style={{ width: 45, height: 45 }}
                  />
                </View>
                <Text
                  style={[styles.sendOptionText, { color: theme.colors.text }]}
                >
                  {t("sendToDokoUser")}
                </Text>
              </TouchableOpacity>

              {/* Send Money Internationally */}
              <TouchableOpacity
                style={[
                  styles.sendOption,
                  { backgroundColor: theme.colors.card },
                ]}
                onPress={() => {
                  setIsSendModalVisible(false);
                  navigation.navigate("SendInternational");
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.sendOptionIcon, styles.internationalIcon]}>
                  <Image
                    source={require("../assets/Images/SendMoney.png")}
                    resizeMode="contain"
                    style={{ width: 45, height: 45 }}
                  />
                </View>
                <Text
                  style={[styles.sendOptionText, { color: theme.colors.text }]}
                >
                  {t("sendMoneyInternationally")}
                </Text>
              </TouchableOpacity>

              {/* Send Via Bank Transfer */}
              <TouchableOpacity
                style={[
                  styles.sendOption,
                  { backgroundColor: theme.colors.card },
                ]}
                onPress={() => {
                  setIsSendModalVisible(false);
                  navigation.navigate("BankTransfer");
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.sendOptionIcon, styles.bankIcon]}>
                  <Image
                    source={require("../assets/Images/BankICons.png")}
                    resizeMode="contain"
                    style={{ width: 45, height: 45 }}
                  />
                </View>
                <Text
                  style={[styles.sendOptionText, { color: theme.colors.text }]}
                >
                  {t("sendViaBankTransfer")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 40,
  },
  header: {
    paddingTop: 10,
  },
  mainHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  web3Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  qrCodeWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  qrCodeContainer: {
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  walletAddressContainer: {
    width: "100%",
    marginTop: 20,
  },
  walletAddressBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  walletAddressText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 12,
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
  },
  web3SkeletonLine: {
    height: 14,
    borderRadius: 8,
  },
  qrSkeletonBox: {
    width: 260,
    height: 260,
    borderRadius: 24,
  },
  addressSkeletonBox: {
    width: "100%",
    height: 56,
    borderRadius: 12,
  },
  web3BalanceRow: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  web3BalanceLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  web3BalanceValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  web3StatusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  web3StatusText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
  hamburger: {
    width: 45,
    height: 45,
    borderRadius: 3,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#F3F4F6',
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  accountSelector: {
    flex: 1,
    marginHorizontal: 10,
    marginLeft: 14,
    borderRadius: 20,
    // borderWidth: 1,
    padding: 12,
  },
  profileButton: {
    padding: 8,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    // paddingHorizontal: 20,
    paddingBottom: 140,
  },

  accountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  walletTypeContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    // marginBottom: 16,
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
    fontWeight: "600",
    marginBottom: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 13,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#F3F4F6',
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "700",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterButtons: {
    flexDirection: "row",
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
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 13,
  },
  walletTypeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  walletTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardIconsContainer: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginBottom: 16,
    paddingTop: 18,
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    minHeight: 200,
    maxHeight: "50%",
  },
  modalGrabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sendOptionsContainer: {
    gap: 16,
  },
  sendOption: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  sendOptionIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  internationalIcon: {
    // backgroundColor: '#6B7280',
  },
  primaryCard: {
    // marginHorizontal: 20,
    // borderRadius: 16,
    // padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  actionButtons: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  actionButtons1: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 0.5,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardBalance: {
    fontSize: 14,
    opacity: 0.8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: "500",
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
    fontWeight: "700",
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  totalBalanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    gap: 10,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: "700",
  },
  transactionFiltersContainer: {
    flexDirection: "row",
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
    fontWeight: "500",
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
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
    fontWeight: "600",
  },
  seeAllButton: {
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#282831",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    paddingVertical: 40,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
  },
  bottomNavIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  bottomNavHomeIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  bottomNavLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default Wallet;
