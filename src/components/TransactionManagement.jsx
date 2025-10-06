import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import Svg, { Circle, G, Path } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const TransactionManagement = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDateValue, setFromDateValue] = useState(new Date());
  const [toDateValue, setToDateValue] = useState(new Date());
  
  // New state for export functionality
  const [authToken, setAuthToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [exportData, setExportData] = useState('');

  // Load auth token and transactions
  useEffect(() => {
    loadAuthToken();
  }, []);

  useEffect(() => {
    if (authToken) {
      loadTransactions();
    }
  }, [authToken]);

  const loadAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      setAuthToken(token);
    } catch (error) {
      console.error('Error loading auth token:', error);
    }
  };

  const loadTransactions = async () => {
    if (!authToken) return;
    
    setIsLoading(true);
    try {
      const response = await authService.getTransactionList(authToken);
      if (response.success) {
        setTransactions(response.data.docs || []);
      } else {
        console.error('Failed to load transactions:', response.error);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export transactions function
  const handleExportTransactions = async () => {
    if (!authToken) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication required',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Map selected type to API type
      let apiType = 'all';
      if (selectedType === 'Deposit') {
        apiType = 'deposit';
      } else if (selectedType === 'Withdrawal') {
        apiType = 'withdrawal';
      } else if (selectedType === 'Subscription') {
        apiType = 'subscription';
      }

      const response = await authService.getTransactionList(
        authToken,
        fromDateValue,
        toDateValue,
        apiType
      );

      if (response.success) {
        const transactionData = response.data.docs || [];
        setTransactions(transactionData);
        
        // Format data for export
        const formattedData = formatTransactionData(transactionData);
        setExportData(formattedData);
        setShowShareModal(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error || 'Failed to fetch transactions',
        });
      }
    } catch (error) {
      console.error('Export transactions error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format transaction data for export
  const formatTransactionData = (transactions) => {
    let csvData = 'Date,Type,Amount,Currency,Status,Description\n';
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      const type = transaction.type || 'Unknown';
      const amount = transaction.amount || 0;
      const currency = transaction.currency || 'USD';
      const status = transaction.status || 'Unknown';
      const description = transaction.description || 'No description';
      
      csvData += `${date},${type},${amount},${currency},${status},"${description}"\n`;
    });
    
    return csvData;
  };

  // Share functionality
  const handleShare = async () => {
    try {
      await Share.share({
        message: exportData,
        title: 'Transaction Export',
      });
    } catch (error) {
      console.error('Share error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share data',
      });
    }
  };

  const filterOptions = ['All', 'Send', 'Receive', 'Pending', 'Failed'];

  const typeOptions = [
    'All',
    'Deposit',
    'Withdrawal',
    'Subscription'
  ];

  const statusOptions = [
    'All Status',
    'Completed',
    'Pending',
    'Failed',
    'Cancelled',
    'Processing'
  ];

  const networkOptions = [
    'All Networks',
    'Ethereum',
    'Bitcoin',
    'Polygon',
    'Binance Smart Chain',
    'Avalanche',
    'Solana'
  ];

  // Date picker handlers
  const handleFromDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowFromDatePicker(false);
    }
    if (selectedDate) {
      setFromDateValue(selectedDate);
      setFromDate(formatDate(selectedDate));
      
      // If to date is before from date, update to date
      if (selectedDate > toDateValue) {
        setToDateValue(selectedDate);
        setToDate(formatDate(selectedDate));
      }
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowToDatePicker(false);
    }
    if (selectedDate) {
      setToDateValue(selectedDate);
      setToDate(formatDate(selectedDate));
    }
  };

  const openFromDatePicker = () => {
    setShowToDatePicker(false); // Close other picker
    setShowFromDatePicker(true);
  };

  const openToDatePicker = () => {
    setShowFromDatePicker(false); // Close other picker
    setShowToDatePicker(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Clear date filters
  const clearDateFilters = () => {
    setFromDate('');
    setToDate('');
    setFromDateValue(new Date());
    setToDateValue(new Date());
  };

  // Analytics data for the donut chart
  const analyticsData = [
    { label: '-Select Network-', value: 35, color: '#2E5FFF' },
    { label: '-Select Network-', value: 30, color: '#F5A623' },
    { label: '-Select Network-', value: 20, color: '#0ACB91' },
    { label: '-Select Network-', value: 15, color: '#D82F00' }
  ];



  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
         case 'COMPLETED':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Safe string conversion for search
    const safeString = (value) => {
      if (value === null || value === undefined) return '';
      return String(value);
    };

    const matchesSearch = safeString(transaction.recipient?.firstName || transaction.recipient?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeString(transaction.initiator?.firstName || transaction.initiator?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeString(transaction.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeString(transaction.amount || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'All' ||
      (selectedFilter === 'Send' && (transaction.type === 'chat_payment' || transaction.type === 'send')) ||
      (selectedFilter === 'Receive' && (transaction.type === 'receive' || transaction.type === 'deposit')) ||
      (selectedFilter === 'Pending' && transaction.status === 'pending') ||
      (selectedFilter === 'Failed' && transaction.status === 'failed');

    return matchesSearch && matchesFilter;
  });

  const DropdownModal = ({ visible, onClose, options, selectedValue, onSelect, title }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  {
                    backgroundColor: selectedValue === option ? theme.colors.primary + '20' : 'transparent',
                    borderBottomColor: theme.colors.border
                  }
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  {
                    color: selectedValue === option ? theme.colors.primary : theme.colors.text,
                    fontWeight: selectedValue === option ? '600' : '400'
                  }
                ]}>
                  {option}
                </Text>
                {selectedValue === option && (
                  <AntDesign name="check" size={16} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const DropdownButton = ({ title, value, onPress, placeholder }) => (
    <TouchableOpacity style={[styles.dropdownButton, { borderWidth: 1, borderColor: theme.colors.border }]} onPress={onPress}>
      <Text style={[styles.dropdownText, { color: value ? theme.colors.text : theme.colors.textSecondary }]}>
        {value || placeholder}
      </Text>
      <AntDesign name="down" size={16} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const DateInput = ({ value, placeholder, onPress, isFromDate = false, onClear }) => (
    <View style={styles.dateInputContainer}>
      <TouchableOpacity 
        style={[
          styles.dateInput, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: value ? theme.colors.primary : theme.colors.border,
            borderWidth: value ? 2 : 1
          }
        ]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.dateInputContent}>
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={value ? theme.colors.primary : theme.colors.textSecondary} 
            style={{ marginRight: 8 }}
          />
          <Text style={[
            styles.dateText, 
            { 
              color: value ? theme.colors.text : theme.colors.textSecondary,
              fontWeight: value ? '500' : '400'
            }
          ]}>
            {value || placeholder}
          </Text>
        </View>
        {value && onClear && (
          <TouchableOpacity 
            onPress={onClear}
            style={styles.clearDateButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

  // Donut Chart Component
  const DonutChart = ({ data, size = 230 }) => {
    const radius = (size - 40) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    const strokeWidth = 30;
    const innerRadius = radius - strokeWidth;

    let cumulativePercentage = 0;

    const createArcPath = (startAngle, endAngle, radius) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };

    return (
      <Svg width={size} height={size}>
        <G>
          {data.map((item, index) => {
            const startAngle = cumulativePercentage * 3.6;
            const endAngle = (cumulativePercentage + item.value) * 3.6;
            const path = createArcPath(startAngle, endAngle, radius);
            cumulativePercentage += item.value;

            return (
              <Path
                key={index}
                d={path}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>
    );
  };

  // Analytics Card Component
  const AnalyticsCard = () => (
    <View style={[styles.analyticsCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.analyticsHeader}>
        <Text style={[styles.analyticsTitle, { color: theme.colors.text }]}>
          Transaction Analytics
        </Text>
        <Text style={[styles.analyticsSubtitle, { color: theme.colors.textSecondary }]}>
          Visual overview of your transaction history
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <DonutChart data={analyticsData} size={230} />
      </View>

      <View style={styles.legendContainer}>
        {analyticsData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: item.color }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Transaction Item Component
  const TransactionItem = ({ transaction }) => {
    const getTransactionIcon = (type) => {
      switch (type) {
        case 'subscription':
          return 'card-outline';
        case 'chat_payment':
          return 'chatbubble-outline';
        case 'deposit':
          return 'arrow-down-circle';
        case 'withdrawal':
          return 'arrow-up-circle';
        default:
          return 'swap-horizontal-outline';
      }
    };

    const getTransactionColor = (type, status) => {
      if (status === 'failed' || status === 'cancelled') return '#EF5350';
      if (status === 'pending') return '#FFA726';
      if (type === 'subscription') return '#9C27B0';
      if (type === 'chat_payment') return '#2196F3';
      if (type === 'deposit') return '#4CAF50';
      if (type === 'withdrawal') return '#FF9800';
      return '#757575';
    };

    const formatAmount = (amount, currency) => {
      return `${currency} ${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getTransactionTitle = (transaction) => {
      if (transaction.type === 'subscription') {
        return 'Subscription Payment';
      } else if (transaction.type === 'chat_payment') {
        return 'Chat Payment';
      } else if (transaction.type === 'deposit') {
        return 'Deposit';
      } else if (transaction.type === 'withdrawal') {
        return 'Withdrawal';
      }
      return transaction.description || 'Transaction';
    };

    const getTransactionSubtitle = (transaction) => {
      if (transaction.recipient?.firstName) {
        return `To: ${transaction.recipient.firstName} ${transaction.recipient.lastName || ''}`.trim();
      } else if (transaction.initiator?.firstName) {
        return `From: ${transaction.initiator.firstName} ${transaction.initiator.lastName || ''}`.trim();
      }
      return transaction.description || 'Transaction';
    };

    return (
      <View style={[styles.transactionCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionIconContainer}>
            <View style={[
              styles.transactionIcon,
              { backgroundColor: getTransactionColor(transaction.type, transaction.status) + '20' }
            ]}>
              <Ionicons 
                name={getTransactionIcon(transaction.type)} 
                size={20} 
                color={getTransactionColor(transaction.type, transaction.status)} 
              />
            </View>
          </View>
          
          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
              {getTransactionTitle(transaction)}
            </Text>
            <Text style={[styles.transactionSubtitle, { color: theme.colors.textSecondary }]}>
              {getTransactionSubtitle(transaction)}
            </Text>
          </View>
          
          <View style={styles.transactionAmountContainer}>
            <Text style={[
              styles.transactionAmount,
              { color: theme.colors.text }
            ]}>
              {formatAmount(transaction.amount, transaction.currency)}
            </Text>
            <View style={styles.statusContainer}>
              <Ionicons 
                name={getStatusIcon(transaction.status)} 
                size={12} 
                color={getStatusColor(transaction.status)} 
              />
              <Text style={[
                styles.statusText,
                { color: getStatusColor(transaction.status) }
              ]}>
                {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
          {formatDate(transaction.createdAt)}
        </Text>
      </View>
    );
  };



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.headerTop}>

        <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xl }]}>
          Transaction Management
        </Text>
        {/* <TouchableOpacity>
            <Ionicons name="filter" size={24} color={theme.colors.text} />
          </TouchableOpacity> */}
      </View>

      {/* Transaction List */}
      <ScrollView
        style={styles.transactionList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionListContent}
      >
        <View style={[styles.header, {}]}>


          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search transactions..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Section */}
          <View style={styles.filterSection}>
            {/* Dropdown Filters */}
            <View style={styles.dropdownContainer}>
              <DropdownButton
                title="Type"
                value={selectedType}
                onPress={() => setShowTypeModal(true)}
                placeholder="-Select Type-"
              />
              <DropdownButton
                title="Status"
                value={selectedStatus}
                onPress={() => setShowStatusModal(true)}
                placeholder="-Select Status-"
              />
              <DropdownButton
                title="Network"
                value={selectedNetwork}
                onPress={() => setShowNetworkModal(true)}
                placeholder="-Select Network-"
              />
            </View>

             {/* Date Inputs */}
             <View style={styles.dateContainer}>
               <DateInput
                 value={fromDate}
                 placeholder="From Date"
                 isFromDate={true}
                 onPress={openFromDatePicker}
                 onClear={() => {
                   setFromDate('');
                   setFromDateValue(new Date());
                 }}
               />
               <DateInput
                 value={toDate}
                 placeholder="To Date"
                 isFromDate={false}
                 onPress={openToDatePicker}
                 onClear={() => {
                   setToDate('');
                   setToDateValue(new Date());
                 }}
               />
             </View>

             {/* Clear All Filters Button */}
             {(fromDate || toDate || selectedType !== 'All' || selectedStatus || selectedNetwork) && (
               <TouchableOpacity
                 style={[styles.clearFiltersButton, { backgroundColor: theme.colors.surface }]}
                 onPress={() => {
                   clearDateFilters();
                   setSelectedType('All');
                   setSelectedStatus('');
                   setSelectedNetwork('');
                 }}
               >
                 <Ionicons name="refresh-outline" size={16} color={theme.colors.textSecondary} />
                 <Text style={[styles.clearFiltersText, { color: theme.colors.textSecondary }]}>
                   Clear All Filters
                 </Text>
               </TouchableOpacity>
             )}

            <TouchableOpacity
              style={{ paddingTop: 10 }}
              onPress={handleExportTransactions}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
                {isLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    <Text
                      style={[
                        styles.createAccountText,
                        {
                          fontFamily: theme.typography.fontFamily,
                          fontSize: theme.typography.sizes.md,
                          fontWeight: theme.typography.weights.medium,
                          color: "#fff",
                        },
                      ]}
                    >
                      Exporting...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.createAccountText,
                      {
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.medium,
                        color: "#fff",
                      },
                    ]}
                  >
                    Export Transactions
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ paddingVertical: 15 }}>

              <Button
                title={!show ? "Show Analytics"  :"Hide Analytics"}
                variant="outline"
                onPress={() => setShow(!show)}
              />
            </View>

            {show && <AnalyticsCard />}

            {/* Transaction List */}
            <View style={styles.transactionListSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Transactions
              </Text>
              
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                    Loading transactions...
                  </Text>
                </View>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <TransactionItem key={transaction._id || index} transaction={transaction} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={64} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                    No Transactions Found
                  </Text>
                  <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
                    {searchQuery ? 'Try adjusting your search criteria' : 'Your transaction history will appear here'}
                  </Text>
                </View>
              )}
            </View>

          </View>
        </View>

      </ScrollView>

      {/* Dropdown Modals */}
      <DropdownModal
        visible={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        options={typeOptions}
        selectedValue={selectedType}
        onSelect={setSelectedType}
        title="Select Type"
      />
      <DropdownModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        options={statusOptions}
        selectedValue={selectedStatus}
        onSelect={setSelectedStatus}
        title="Select Status"
      />
      <DropdownModal
        visible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        options={networkOptions}
        selectedValue={selectedNetwork}
        onSelect={setSelectedNetwork}
        title="Select Network"
      />

      {/* Date Pickers */}
      {showFromDatePicker && (
        <Modal
          visible={showFromDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFromDatePicker(false)}
        >
          <View style={styles.datePickerModalOverlay}>
            <View style={[styles.datePickerModal, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.datePickerHeader, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>
                  Select From Date
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowFromDatePicker(false)}
                  style={styles.datePickerCloseButton}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerContent}>
                <DateTimePicker
                  value={fromDateValue}
                  mode="date"
                  display="spinner"
                  onChange={handleFromDateChange}
                  maximumDate={toDateValue || new Date()}
                  minimumDate={new Date(2020, 0, 1)}
                />
              </View>
              
              <View style={[styles.datePickerActions, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.datePickerCancelButton]}
                  onPress={() => setShowFromDatePicker(false)}
                >
                  <Text style={[styles.datePickerButtonText, { color: theme.colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                  onPress={() => setShowFromDatePicker(false)}
                >
                  <Text style={styles.datePickerConfirmText}>
                    Select
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      
      {showToDatePicker && (
        <Modal
          visible={showToDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowToDatePicker(false)}
        >
          <View style={styles.datePickerModalOverlay}>
            <View style={[styles.datePickerModal, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.datePickerHeader, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>
                  Select To Date
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowToDatePicker(false)}
                  style={styles.datePickerCloseButton}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerContent}>
                <DateTimePicker
                  value={toDateValue}
                  mode="date"
                  display="spinner"
                  onChange={handleToDateChange}
                  maximumDate={new Date()}
                  minimumDate={fromDateValue || new Date(2020, 0, 1)}
                />
              </View>
              
              <View style={[styles.datePickerActions, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.datePickerCancelButton]}
                  onPress={() => setShowToDatePicker(false)}
                >
                  <Text style={[styles.datePickerButtonText, { color: theme.colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                  onPress={() => setShowToDatePicker(false)}
                >
                  <Text style={styles.datePickerConfirmText}>
                    Select
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View style={styles.shareModalOverlay}>
          <View style={[styles.shareModalContainer, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.shareModalHeader, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.shareModalTitle, { color: theme.colors.text }]}>
                Export Transactions
              </Text>
              <TouchableOpacity
                onPress={() => setShowShareModal(false)}
                style={styles.shareModalCloseButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.shareModalContent}>
              <Text style={[styles.shareModalDescription, { color: theme.colors.text }]}>
                Your transaction data has been formatted and is ready to share. 
                You can share it via email, messaging apps, or save it to your device.
              </Text>
              
              <View style={[styles.exportPreview, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.exportPreviewText, { color: theme.colors.text }]}>
                  {exportData.substring(0, 200)}...
                </Text>
              </View>
              
              <Text style={[styles.exportStats, { color: theme.colors.textSecondary }]}>
                {transactions.length} transactions exported
              </Text>
            </View>
            
            <View style={[styles.shareModalActions, { backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity
                style={[styles.shareModalButton, styles.cancelButton]}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={[styles.shareModalButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.shareModalButton, styles.shareButton]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.shareButtonText}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 50,
    marginBottom: 16,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  filterSection: {
    // paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'System',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'System',
    flex: 1,
  },
  clearDateButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'System',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 16,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'System',
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  analyticsCard: {
    // marginHorizontal: 20,
    marginVertical: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyticsHeader: {
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'System',
  },
  analyticsSubtitle: {
    fontSize: 12,
    fontFamily: 'System',
    paddingBottom: 14,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'System',
  },
  iosPickerContainer: {
    backgroundColor: 'transparent',
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iosPickerButton: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  iosDatePicker: {
    backgroundColor: 'transparent',
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionListContent: {
    // paddingTop: 20,
    paddingBottom: 100,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    marginRight: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  transactionSubtitle: {
    fontSize: 14,
    fontFamily: 'System',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'System',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'System',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  shareModalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  shareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  shareModalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  shareModalCloseButton: {
    padding: 4,
  },
  shareModalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  shareModalDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  exportPreview: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exportPreviewText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  exportStats: {
    fontSize: 14,
    textAlign: 'center',
  },
  shareModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  shareModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  shareButton: {
    backgroundColor: '#1AA5FF',
  },
  shareModalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionListSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'System',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'System',
  },
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  datePickerModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  datePickerCloseButton: {
    padding: 4,
  },
  datePickerContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  datePickerActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  datePickerConfirmButton: {
    backgroundColor: '#1AA5FF',
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  datePickerConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default TransactionManagement;
