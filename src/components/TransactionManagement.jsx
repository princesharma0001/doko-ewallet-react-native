import React, { useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import Svg, { Circle, G, Path } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const TransactionManagement = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedType, setSelectedType] = useState('');
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


  const filterOptions = ['All', 'Send', 'Receive', 'Pending', 'Failed'];

  const typeOptions = [
    'All Types',
    'Send Money',
    'Receive Money',
    'Transfer',
    'Payment',
    'Withdrawal',
    'Deposit'
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

  // Analytics data for the donut chart
  const analyticsData = [
    { label: '-Select Network-', value: 35, color: '#2E5FFF' },
    { label: '-Select Network-', value: 30, color: '#F5A623' },
    { label: '-Select Network-', value: 20, color: '#0ACB91' },
    { label: '-Select Network-', value: 15, color: '#D82F00' }
  ];

  const transactions = [
    {
      id: 1,
      type: 'send',
      amount: '$1,200.00',
      currency: 'USD',
      recipient: 'John Doe',
      status: 'completed',
      date: '2024-01-15',
      time: '10:30 AM',
      icon: 'arrow-up-right',
      color: '#FF6B6B',
    },
    {
      id: 2,
      type: 'receive',
      amount: '$850.50',
      currency: 'USD',
      sender: 'Jane Smith',
      status: 'completed',
      date: '2024-01-14',
      time: '2:15 PM',
      icon: 'arrow-down-left',
      color: '#4ECDC4',
    },
    {
      id: 3,
      type: 'send',
      amount: '$2,500.00',
      currency: 'USD',
      recipient: 'Business Account',
      status: 'pending',
      date: '2024-01-13',
      time: '9:45 AM',
      icon: 'arrow-up-right',
      color: '#FFA726',
    },
    {
      id: 4,
      type: 'receive',
      amount: '$1,800.75',
      currency: 'USD',
      sender: 'Investment Fund',
      status: 'completed',
      date: '2024-01-12',
      time: '4:20 PM',
      icon: 'arrow-down-left',
      color: '#66BB6A',
    },
    {
      id: 5,
      type: 'send',
      amount: '$500.00',
      currency: 'USD',
      recipient: 'Family Member',
      status: 'failed',
      date: '2024-01-11',
      time: '11:30 AM',
      icon: 'arrow-up-right',
      color: '#EF5350',
    },
    {
      id: 6,
      type: 'receive',
      amount: '$3,200.00',
      currency: 'USD',
      sender: 'Salary Payment',
      status: 'completed',
      date: '2024-01-10',
      time: '8:00 AM',
      icon: 'arrow-down-left',
      color: '#42A5F5',
    },
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
      case 'pending':
        return 'time';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'All' ||
      (selectedFilter === 'Send' && transaction.type === 'send') ||
      (selectedFilter === 'Receive' && transaction.type === 'receive') ||
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

  const DateInput = ({ value, placeholder, onPress, isFromDate = false }) => (
    <TouchableOpacity style={[styles.dateInput, { backgroundColor: theme.colors.surface }]} onPress={onPress}>
      <Text style={[styles.dateText, { color: value ? theme.colors.text : theme.colors.textSecondary }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
    </TouchableOpacity>
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
               />
               <DateInput
                 value={toDate}
                 placeholder="To Date"
                 isFromDate={false}
                 onPress={openToDatePicker}
               />
             </View>

            <TouchableOpacity
              style={{ paddingTop: 10 }}
              onPress={()=> navigation.navigate("CurrentHistory")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
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
        <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : null}>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity onPress={() => setShowFromDatePicker(false)}>
                <Text style={[styles.iosPickerButton, { color: theme.colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={fromDateValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'compact' : 'default'}
            onChange={handleFromDateChange}
            maximumDate={new Date()}
            style={Platform.OS === 'ios' ? styles.iosDatePicker : null}
          />
        </View>
      )}
      {showToDatePicker && (
        <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : null}>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity onPress={() => setShowToDatePicker(false)}>
                <Text style={[styles.iosPickerButton, { color: theme.colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={toDateValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'compact' : 'default'}
            onChange={handleToDateChange}
            maximumDate={new Date()}
            style={Platform.OS === 'ios' ? styles.iosDatePicker : null}
          />
        </View>
      )}
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
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateText: {
    fontSize: 16,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 16,
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
});

export default TransactionManagement;
