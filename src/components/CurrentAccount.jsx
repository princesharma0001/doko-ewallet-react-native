import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import KycModal from "../components/KycModal";
import { useAppDispatch, useAppSelector } from "../store";
import { getWalletList } from "../store/slices/walletSlice";
import { authService, transactionHistoryService } from "../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchUsernameModal from "./SearchUsernameModal";
import Toast from "react-native-toast-message";

const CurrentAccount = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isRateLoading, setIsRateLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  console.log("sdagasdgasd", transactions);
  const [showSearchUsernameModal, setShowSearchUsernameModal] = useState(false);
  const { currentUser, isProfileLoading, profileError } = useAppSelector(
    (state) => state.user
  );

  console.log("asfdsagasd", currentUser);

  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);

  // Currency configuration
  const currencies = [
    {
      code: "NPR",
      symbol: "NPR",
      name: "Nepalese Rupee",
      flag: require("../assets/Images/nepal.webp"),
    }, // TODO: Add Nepal.png flag
    {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      flag: require("../assets/Images/USA.png"),
    },
  ];

  const currentCurrency = currencies.find(
    (currency) => currency.code === selectedCurrency
  );

  // Currency selection handler
  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    setShowCurrencyPicker(false);
  };

  const handleOptionPress = (option) => {
    console.log("Selected option:", option.title);

    setShowSearchUsernameModal(true);
  };
  const handleUserSelect = (user) => {
    console.log("Selected user:", user.username);
    setShowSearchUsernameModal(false);
  };

  // Convert NPR to USD using exchange rate
  const convertToUSD = (nprAmount) => {
    if (!exchangeRate || selectedCurrency === "NPR") {
      return nprAmount;
    }
    return nprAmount / exchangeRate;
  };

  // Get display amount based on selected currency
  const getDisplayAmount = () => {
    if (!defaultWallet) return 0;

    if (selectedCurrency === "NPR") {
      return defaultWallet.balance;
    } else {
      return convertToUSD(defaultWallet.balance);
    }
  };

  // Redux state
  const dispatch = useAppDispatch();
  const { defaultWallet, isWalletListLoading, walletListError } =
    useAppSelector((state) => state.wallet);
  console.log("SADgasdgasd", defaultWallet);

  // Fetch wallet data when component mounts
  useEffect(() => {
    dispatch(getWalletList());
    fetchExchangeRate();
    fetchTransactions();
  }, [dispatch]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWalletList());
      fetchExchangeRate();
      fetchTransactions();
    }, [dispatch])
  );
  const fetchExchangeRate = async () => {
    try {
      setIsRateLoading(true);
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (!res.ok) {
        throw new Error(`Failed to fetch exchange rates: ${res.statusText}`);
      }

      const data = await res.json();

      // USD → NPR
      const usdToNpr = data.rates.NPR;
      console.log("Exchange rate USD to NPR:", usdToNpr);

      setExchangeRate(usdToNpr);
      console.log(`USD → NPR: ${usdToNpr}`);

      return usdToNpr;
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      setExchangeRate(null);
      return null;
    } finally {
      setIsRateLoading(false);
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setIsTransactionsLoading(true);
      setTransactionsError(null);

      const token = await AsyncStorage.getItem("dokoToken");
      if (!token) {
        setTransactionsError(t("authenticationRequired"));
        return;
      }

      // Use the new transaction history endpoint
      const result = await transactionHistoryService.getUserTransactionHistory(
        undefined,
        token
      );

      if (result.success) {
        setTransactions(result.docs || result.data?.docs || []);
        console.log(
          "Transactions fetched successfully:",
          result.data?.docs?.length || 0
        );
      } else {
        setTransactionsError(result.error || t("failedToFetchTransactions"));
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactionsError(t("anErrorOccurredWhileFetching"));
      setTransactions([]);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(getWalletList()).unwrap();
      await fetchExchangeRate();
      await fetchTransactions();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Debug modal state
  React.useEffect(() => {
    console.log("Modal visibility changed:", isSendModalVisible);
  }, [isSendModalVisible]);

  // Handler functions
  const handleSendPress = () => {
    console.log("Send button pressed!");
    if (currentUser.kycStatus === "APPROVED") {
      setShowLogoutModal(true);
      // setIsSendModalVisible(true);
    } else {
      setShowLogoutModal(true);
    }
  };

  const handleSendPressDeposit = () => {
    console.log("Send button pressed!");
    if (currentUser.kycStatus === "APPROVED") {
      // setShowLogoutModal(true);
      navigation.navigate("CreditCard");
    } else {
      setShowLogoutModal(true);
    }
  };

  const handleSendPressDepositQR = () => {
    console.log("Send button pressed!");
    if (currentUser.kycStatus === "APPROVED") {
      // setShowLogoutModal(true);
      navigation.navigate("QrCodeSendRecive");
    } else {
      setShowLogoutModal(true);
    }
  };

  const handleSendOption = (option) => {
    setIsSendModalVisible(false);
    Alert.alert(t("sendOptionSelected"), `${t("youSelected")} ${option}`, [
      { text: t("ok") },
    ]);
  };

  // Helper functions for transaction formatting
  const getTransactionIcon = (type, subType) => {
    if (type === "transfer") {
      return subType === "sent"
        ? require("../assets/Images/quick1.png")
        : require("../assets/Images/quick1.png");
    } else if (type === "deposit") {
      return require("../assets/Images/QuickRec.png");
    }
    return require("../assets/Images/quick1.png");
  };

  const getTransactionType = (transaction) => {
    console.log("sdfsdafsda", transaction);

    // if (transaction.type === 'CHAT_PAYMENT_SEND') {
    const senderName =
      transaction?.userId?.username ||
      transaction?.userId?.firstName ||
      transaction?.userId?.firstName ||
      t("unknownSender");

    const receiverName =
      transaction?.receiverId?.username ||
      transaction?.receiverId?.firstName ||
      transaction?.receiverId?.username ||
      transaction?.receiverId?.firstName ||
      t("unknownReceiver");

    if (
      transaction?.category === "TRANSFER" &&
      transaction?.type !== "DEPOSIT"
    ) {
      return `${t("sentTo")} ${receiverName}`;
    } else if (
      transaction?.category === "INCOME" &&
      transaction?.type !== "DEPOSIT"
    ) {
      return `${t("receivedFrom")} ${receiverName}`;
    } else if (transaction?.type === "DEPOSIT") {
      return t("walletDeposit");
    } else if (transaction?.category === "EXPENSE") {
      return t("subscriptionPurchase");
    }
    return t("transactionWith");
  };

  const getTransactionAmount = (transaction) => {
    const amount = transaction.amount;
    const currency = transaction.currency;
    const symbol = currency === "NPR" ? "₨" : "$";

    if (transaction.category === "TRANSFER") {
      return `-${symbol}${amount}`;
    } else {
      return `+${symbol}${amount}`;
    }
  };

  const formatTransactionTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return t("justNow");
    } else if (diffInHours < 24) {
      return `${diffInHours}${t("hoursAgo")}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}${t("daysAgo")}`;
    }
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.type === "transfer") {
      if (transaction.metadata?.receiver) {
        return `${t("to")} ${transaction.metadata.receiver.firstName} ${
          transaction.metadata.receiver.lastName
        }`;
      }
      return transaction.description || t("transfer");
    } else if (transaction.type === "deposit") {
      return t("walletTopUp");
    }
    return transaction.description || t("transaction");
  };

  const renderBalanceSection = () => (
    <View style={[styles.balanceSection, {}]}>
      <View style={styles.balanceHeader}>
        <Text
          style={[
            styles.balanceLabel,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              fontWeight: "700",
            },
          ]}
        >
          {t("yourBalance")}
        </Text>

        {/* Currency Dropdown */}
        <TouchableOpacity
          style={[
            styles.currencySelector,
            {
              // backgroundColor: theme.colors.surface,
              // borderColor: theme.colors.border || 'rgba(255, 255, 255, 0.2)'
            },
          ]}
          onPress={() => setShowCurrencyPicker(true)}
          activeOpacity={0.7}
        >
          <Image
            source={
              currentCurrency?.flag || require("../assets/Images/USA.png")
            }
            style={styles.flagIcon}
          />
          <Text style={[styles.currencyText, { color: theme.colors.text }]}>
            {selectedCurrency}
          </Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={theme.colors.textSecondary}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      </View>
      {isWalletListLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <Text
          style={[
            styles.balanceAmount,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
            },
          ]}
        >
          {defaultWallet ? (
            <>
              <Text
                style={{
                  fontSize: 18, // 👈 smaller font size for currency
                  fontFamily: theme.typography.fontFamily,
                  color: theme.colors.text,
                }}
              >
                {currentCurrency?.symbol || selectedCurrency}{" "}
              </Text>
              {Math.floor(getDisplayAmount()).toLocaleString()}
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: theme.typography.fontFamily,
                  color: theme.colors.text,
                }}
              >
                .{getDisplayAmount().toFixed(2).split(".")[1]}
              </Text>
            </>
          ) : (
            t("noWalletFound")
          )}
        </Text>
      )}
    </View>
  );

  const renderActionButtons = () => (
    <View
      style={[
        styles.actionButtons,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Send (Active) */}
      <TouchableOpacity style={styles.actionButton} onPress={handleSendPress}>
        {/* <View style={[styles.iconWrapper, styles.activeIcon]}> */}
        <View style={{ paddingBottom: 10 }}>
          <Image
            source={require("../assets/Images/SendIcon.png")}
            resizeMode="contain"
            style={[
              styles.iconImage,
              { tintColor: isDarkMode ? null : "gray" },
            ]}
          />
        </View>
        {/* </View> */}
        <Text
          style={[
            styles.actionText,
            styles.activeText,
            { color: theme.colors.text },
          ]}
        >
          {t("send")}
        </Text>
      </TouchableOpacity>

      {/* Deposit */}
      <TouchableOpacity
        onPress={handleSendPressDeposit}
        style={styles.actionButton}
      >
        {/* <View style={styles.iconWrapper}> */}
        <View style={{ paddingBottom: 10 }}>
          <Image
            source={require("../assets/Images/Add.png")}
            resizeMode="contain"
            style={[
              styles.iconImage,
              { tintColor: isDarkMode ? null : "gray" },
            ]}
          />
        </View>
        {/* </View> */}
        <Text
          style={[
            styles.actionText,
            styles.activeText,
            { color: theme.colors.text },
          ]}
        >
          {t("deposit")}
        </Text>
      </TouchableOpacity>

      {/* Invest */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleSendPressDepositQR}
        // onPress={() => navigation.navigate("QrCodeSendRecive")}
      >
        {/* <View style={styles.iconWrapper}> */}
        <View style={{ paddingBottom: 10 }}>
          <Image
            source={require("../assets/Images/QRCode.png")}
            resizeMode="contain"
            style={[
              styles.iconImage,
              { tintColor: isDarkMode ? null : "gray" },
            ]}
          />
        </View>
        {/* </View> */}
        <Text
          style={[
            styles.actionText,
            styles.activeText,
            { color: theme.colors.text },
          ]}
        >
          {t("qrCode")}
        </Text>
      </TouchableOpacity>

      {/* + Add Card (side tab) */}
      <View style={styles.addCardButton}>
        <Text style={styles.addCardText} numberOfLines={1} ellipsizeMode="clip">
          {t("addCard")}
        </Text>
      </View>
    </View>
  );

  const renderCurrencyPicker = () => (
    <Modal
      visible={showCurrencyPicker}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCurrencyPicker(false)}
    >
      <View style={styles.currencyModalOverlay}>
        <TouchableOpacity
          style={styles.currencyBackdrop}
          activeOpacity={1}
          onPress={() => setShowCurrencyPicker(false)}
        />
        <View
          style={[
            styles.currencyPickerContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border || "rgba(255, 255, 255, 0.1)",
            },
          ]}
        >
          <View style={styles.currencyPickerHeader}>
            <Text
              style={[styles.currencyPickerTitle, { color: theme.colors.text }]}
            >
              {t("selectCurrency")}
            </Text>
            <TouchableOpacity
              onPress={() => setShowCurrencyPicker(false)}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.currencyOptionsContainer}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  {
                    backgroundColor:
                      selectedCurrency === currency.code
                        ? theme.colors.primary || "#1AA5FF"
                        : theme.colors.card || "rgba(255, 255, 255, 0.05)",
                    borderColor:
                      selectedCurrency === currency.code
                        ? theme.colors.primary || "#1AA5FF"
                        : theme.colors.border || "rgba(255, 255, 255, 0.1)",
                  },
                ]}
                onPress={() => handleCurrencySelect(currency.code)}
                activeOpacity={0.7}
              >
                <Image source={currency.flag} style={styles.currencyFlagIcon} />
                <View style={styles.currencyInfo}>
                  <Text
                    style={[
                      styles.currencyCode,
                      {
                        color:
                          selectedCurrency === currency.code
                            ? "#FFFFFF"
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {currency.code}
                  </Text>
                </View>
                {selectedCurrency === currency.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  // Skeleton loading component for transactions
  const TransactionSkeleton = () => (
    <View style={styles.activityItem}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={[styles.activityIcon, styles.skeletonIcon]}>
          <View style={[styles.skeletonCircle]} />
        </View>
        <View style={styles.activityContent}>
          <View
            style={[
              styles.skeletonText,
              { width: 120, height: 16, marginBottom: 6 },
            ]}
          />
          <View style={[styles.skeletonText, { width: 80, height: 12 }]} />
        </View>
        <View style={[styles.skeletonText, { width: 60, height: 16 }]} />
      </View>
    </View>
  );

  const renderLatestTransactions = () => (
    <View
      style={[
        styles.transactionsContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[styles.transactionsTitle, { color: theme.colors.text }]}>
          {t("latestTransactions")}
        </Text>
        {transactions.length > 4 && (
          <Pressable onPress={() => navigation.navigate("CurrentHistory")}>
            <Text
              style={[
                styles.transactionsTitle,
                { color: "#169BFF", fontSize: 14 },
              ]}
            >
              {t("seeAll")}
            </Text>
          </Pressable>
        )}
      </View>

      {isTransactionsLoading ? (
        // Show skeleton loading
        Array.from({ length: 3 })?.map((_, index) => (
          <TransactionSkeleton key={index} />
        ))
      ) : transactionsError ? (
        <View style={styles.errorContainer}>
          <Text
            style={[styles.errorText, { color: theme.colors.textSecondary }]}
          >
            {transactionsError}
          </Text>
        </View>
      ) : transactions?.length > 0 ? (
        transactions?.slice(0, 5)?.map((transaction) => (
          <TouchableHighlight
            key={transaction._id}
            style={styles.activityItem}
            onPress={() => navigation.navigate("CurrentHistory")}
            underlayColor={theme.colors.border}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View style={styles.activityIcon}>
                <Image
                  source={getTransactionIcon(
                    transaction.type,
                    transaction.subType
                  )}
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
                  {/* {transaction?.type} */}
                  {truncateText(getTransactionType(transaction), 40)}
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
                  {formatTransactionTime(transaction.createdAt)}
                </Text>
              </View>
              <Text
                style={[
                  styles.activityAmount,
                  {
                    color: getTransactionAmount(transaction).startsWith("+")
                      ? "#4CAF50"
                      : "#F44336",
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: "700",
                  },
                ]}
              >
                {getTransactionAmount(transaction)}
              </Text>
            </View>
          </TouchableHighlight>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            {t("noTransactionsFound")}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            title={t("pullToRefresh")}
            titleColor={theme.colors.textSecondary}
          />
        }
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
                  setIsSendModalVisible(false),
                    setShowSearchUsernameModal(true);
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
      <SearchUsernameModal
        visible={showSearchUsernameModal}
        onClose={() => setShowSearchUsernameModal(false)}
        onSelectUser={handleUserSelect}
      />
      <KycModal
        isVisible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          navigation.navigate("kycs");
        }}
      />
      {renderCurrencyPicker()}
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
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
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
    marginHorizontal: 25,
    marginRight: 28,
    // marginBottom: 20,
    borderWidth: 0.9,
    borderColor: "#3C3C56",
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
    alignItems: "center",
    justifyContent: "center",
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
    marginRight: -19,
  },
  addCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    transform: [{ rotate: "-90deg" }],
    // <-- when used directly on <Text>
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 13,
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
  activityType: {
    fontSize: 14,
    fontWeight: "500",
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
    fontWeight: "600",
  },
  balanceSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  balanceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 52,
    fontWeight: "700",
    marginBottom: 5,
  },

  transactionsContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: -25,
    zIndex: -11111,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 28,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionTime: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
  },
  // Modal styles
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
  bankIcon: {
    backgroundColor: "#6B7280",
  },
  sendOptionText: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  badge: {
    backgroundColor: "#6B22E7",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  activityIndicator: {
    marginTop: 10,
  },
  // Currency dropdown styles
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    // borderRadius: 25,
    minWidth: 100,
  },
  flagIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
    borderRadius: 2,
    resizeMode: "contain",
  },
  currencyText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  chevronIcon: {
    marginLeft: 2,
  },
  // Currency picker modal styles
  currencyModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  currencyBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currencyPickerContainer: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  currencyPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  currencyPickerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  currencyOptionsContainer: {
    padding: 16,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  currencyFlagIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
    borderRadius: 3,
    resizeMode: "contain",
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 13,
    fontWeight: "500",
  },
  // Transaction loading and error styles
  loadingText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  // Skeleton loading styles
  skeletonIcon: {
    backgroundColor: "transparent",
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  skeletonText: {
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
});

export default CurrentAccount;
