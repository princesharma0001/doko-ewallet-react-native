import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Modal,
    Platform,
    Alert,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { authService, transactionHistoryService } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CurrentHistory = () => {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isFilterActive, setIsFilterActive] = useState(false);


    // Fetch transactions from API
    const fetchTransactions = async (fromDateParam = null, toDateParam = null) => {
        try {
      
            
            setIsLoading(true);
            setError(null);
            
            const token = await AsyncStorage.getItem('dokoToken');
            if (!token) {
                setError('Authentication required');
                return;
            }

      const result = await transactionHistoryService.getUserTransactionHistory(undefined, token);
            
            if (result.success) {
        setTransactions(result.docs || result.data?.docs || []);
                console.log('Transactions fetched successfully:', result.data?.docs?.length || 0);
            } else {
                setError(result.error || 'Failed to fetch transactions');
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('An error occurred while fetching transactions');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter transactions based on selected tab
    const getFilteredTransactions = () => {
        if (selectedFilter === 'All') {
            return transactions;
        } else if (selectedFilter === 'Pending') {
            return transactions.filter(transaction => 
                transaction.transactionStatus === 'PENDING' || 
                transaction.transactionStatus === 'pending' ||
                transaction.transactionStatus === 'INITIATED'
            );
        } else if (selectedFilter === 'Completed') {
            return transactions.filter(transaction => 
                transaction.transactionStatus === 'COMPLETED' || 
                transaction.transactionStatus === 'completed' ||
                transaction.transactionStatus === 'SUCCESS'
            );
        }
        return transactions;
    };

    // Load transactions on component mount
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Reset date picker states when modal closes
    useEffect(() => {
        if (!isFilterModalVisible) {
            setShowFromDatePicker(false);
            setShowToDatePicker(false);
        }
    }, [isFilterModalVisible]);

    // Refresh transactions
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchTransactions();
        setIsRefreshing(false);
    };

    const filters = ['All', 'Pending', 'Completed'];

    // Helper functions for transaction formatting
  const getTransactionType = (transaction) => {
    const receiverName =
      transaction?.receiverId?.username ||
      transaction?.receiverId?.firstName ||
      transaction?.receiverId?.username ||
      transaction?.receiverId?.firstName ||
      'Unknown Receiver';

    if (transaction?.category === "TRANSFER" && transaction?.type !== "DEPOSIT") {
      return `Sent to ${receiverName}`;

    } else if (transaction?.category === "INCOME" && transaction?.type !== "DEPOSIT") {
      return `Received from ${receiverName}`;
    } else if (transaction?.type === "DEPOSIT") {

      return `Wallet Deposit`;
    }
    return `Transaction with`;



  };
    const getTransactionAmount = (transaction) => {
        const amount = transaction.amount;
        const currency = transaction.currency;
        const symbol = currency === 'NPR' ? '₨' : '$';
        
        if (transaction.type === 'transfer' && transaction.subType === 'sent') {
            return `-${symbol}${amount}`;
        } else {
            return `+${symbol}${amount}`;
        }
    };

    const formatTransactionDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTransactionDescription = (transaction) => {
        if (transaction.type === 'transfer') {
            if (transaction.metadata?.receiver) {
                return `To ${transaction.metadata.receiver.firstName} ${transaction.metadata.receiver.lastName}`;
            }
            return transaction.description || 'Transfer';
        } else if (transaction.type === 'deposit') {
            return 'Wallet top-up';
        }
        return transaction.description || 'Transaction';
    };
      const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'success':
                return '#4CAF50';
            case 'pending':
            case 'initiated':
                return '#FF9800';
            case 'failed':
            case 'cancelled':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    // Handler functions
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleFilterPress = () => {
        setIsFilterModalVisible(true);
    };

    const handleFromDateChange = (event, selectedDate) => {
        // Always close the date picker after selection
        setShowFromDatePicker(false);
        
        if (selectedDate) {
            // If toDate is already selected and fromDate is after toDate, clear toDate
            if (toDate && selectedDate > toDate) {
                setToDate(null);
                Alert.alert(
                    'Date Range Updated',
                    'From date is after to date. To date has been cleared.',
                    [{ text: 'OK' }]
                );
            }
            setFromDate(selectedDate);
        }
    };

    const handleToDateChange = (event, selectedDate) => {
        // Always close the date picker after selection
        setShowToDatePicker(false);
        
        if (selectedDate) {
            // If fromDate is already selected and toDate is before fromDate, show error
            if (fromDate && selectedDate < fromDate) {
                Alert.alert(
                    'Invalid Date Range',
                    'To date cannot be before from date. Please select a valid date.',
                    [{ text: 'OK' }]
                );
                return;
            }
            setToDate(selectedDate);
        }
    };

    const handleClearFromDate = () => {
        setFromDate(null);
    };

    const handleClearToDate = () => {
        setToDate(null);
    };


    const handleClearAllDates = () => {
        setFromDate(null);
        setToDate(null);
    };

    const handleClearFilters = async () => {
        // Clear date filters
        setFromDate(null);
        setToDate(null);
        setIsFilterActive(false);
        
        // Close modal
        setIsFilterModalVisible(false);
        
        // Show loading state
        setIsLoading(true);
        
        try {
            // Fetch all transactions without date filters
            await fetchTransactions();
            console.log('Date filters cleared - showing all transactions');
        } catch (error) {
            console.error('Error clearing filters:', error);
            Alert.alert(
                'Error',
                'Failed to clear filters. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleSubmitFilter = async () => {
        // Validate that if both dates are selected, fromDate is not after toDate
        if (fromDate && toDate && fromDate > toDate) {
            Alert.alert(
                'Invalid Date Range',
                'From date cannot be after to date. Please select valid dates.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Close the modal first
        setIsFilterModalVisible(false);

        // Show loading state
        setIsLoading(true);

        try {
            console.log('Submitting filter with dates:', {
                fromDate,
                toDate,
                fromDateType: typeof fromDate,
                toDateType: typeof toDate,
                fromDateIsDate: fromDate instanceof Date,
                toDateIsDate: toDate instanceof Date
            });
            
            // Call API with date filters
            await fetchTransactions(fromDate, toDate);
            
            // Set filter as active if any date is selected
            setIsFilterActive(fromDate !== null || toDate !== null);
            
            const fromDateStr = fromDate ? fromDate.toLocaleDateString() : 'No start date';
            const toDateStr = toDate ? toDate.toLocaleDateString() : 'No end date';
            
            console.log('Filter applied - from:', fromDateStr, 'to:', toDateStr);
        } catch (error) {
            console.error('Error applying filter:', error);
            Alert.alert(
                'Filter Error',
                'Failed to apply date filter. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDateForDisplay = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            //   borderBottomWidth: 1,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backIcon: {
            fontSize: 24,
            fontWeight: 'bold',
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            // flex: 1,
            // textAlign: 'center',
        },
        filterButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        filterIcon: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        filterContainer: {
            flexDirection: 'row',
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            gap: theme.spacing.sm,
        },
        filterTab: {
            flex: 1,
            paddingVertical: theme.spacing.sm,
            //   paddingHorizontal: theme.spacing.md,
            borderRadius: theme.borderRadius.xl,
            borderWidth: 1,
            alignItems: 'center',
        },
        filterText: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
        },
        transactionCard: {
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.sm,
        },
        transactionTitle: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.bold,
            flex: 1,
        },
        transactionDate: {
            fontSize: theme.typography.sizes.sm,
            textAlign: 'right',
        },
        recipientText: {
            fontSize: theme.typography.sizes.md,
            marginBottom: theme.spacing.md,
        },
        transactionDetails: {
            gap: theme.spacing.sm,
        },
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        detailLabel: {
            fontSize: theme.typography.sizes.sm,
        },
        detailValue: {
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
        },
        // Modal styles
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContainer: {
            backgroundColor: '#2C2C37', // Dark purple/blue background
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 32,
            maxHeight: '50%',
        },
        modalGrabber: {
            width: 40,
            height: 4,
            backgroundColor: '#9CA3AF',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
        },
        modalHeader: {
            alignItems: 'center',
            marginBottom: 32,
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
        },
        datePickerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 32,
            gap: 16,
        },
        datePickerContainer: {
            flex: 1,
        },
        datePickerLabel: {
            fontSize: 14,
            color: '#FFFFFF',
            marginBottom: 8,
            fontWeight: '500',
        },
        datePickerButton: {
            borderWidth: 1,
            borderColor: '#464665',
            borderRadius: 8,
            padding: 16,
            backgroundColor: '#1C1C27',
            minHeight: 50,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
        },
        datePickerButtonText: {
            fontSize: 16,
            color: '#FFFFFF',
            textAlign: 'center',
            flex: 1,
        },
        datePickerButtonPlaceholder: {
            fontSize: 16,
            color: '#9E9E9E',
            textAlign: 'center',
            flex: 1,
        },
        clearDateButton: {
            marginLeft: 8,
            padding: 4,
        },
        clearDateText: {
            color: '#FF6B6B',
            fontSize: 12,
            fontWeight: 'bold',
        },
        clearAllButton: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#FF6B6B',
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            marginBottom: 16,
        },
        clearAllButtonText: {
            color: '#FF6B6B',
            fontSize: 14,
            fontWeight: '600',
        },
        submitButton: {
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            marginTop: 0,
            // Gradient will be applied via LinearGradient component
        },
        submitButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
        // Skeleton loading styles
        skeletonText: {
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
        },
        // Error and empty state styles
        errorContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        errorText: {
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 16,
        },
        retryButton: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#1AA5FF',
        },
        retryButtonText: {
            fontSize: 16,
            fontWeight: '600',
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        emptyText: {
            fontSize: 16,
            textAlign: 'center',
        },
        filterActiveIndicator: {
            marginLeft: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        filterActiveText: {
            fontSize: 12,
            fontWeight: '600',
        },
    });

    // Skeleton loading component
    const TransactionSkeleton = () => (
        <View style={[styles.transactionCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.skeletonText, { width: 120, height: 18, marginBottom: 8 }]} />
                <View style={[styles.skeletonText, { width: 80, height: 14 }]} />
            </View>
            <View style={[styles.skeletonText, { width: 150, height: 16, marginBottom: 16 }]} />
            <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                    <View style={[styles.skeletonText, { width: 60, height: 14 }]} />
                    <View style={[styles.skeletonText, { width: 80, height: 14 }]} />
                </View>
                <View style={styles.detailRow}>
                    <View style={[styles.skeletonText, { width: 40, height: 14 }]} />
                    <View style={[styles.skeletonText, { width: 100, height: 14 }]} />
                </View>
                <View style={styles.detailRow}>
                    <View style={[styles.skeletonText, { width: 30, height: 14 }]} />
                    <View style={[styles.skeletonText, { width: 60, height: 14 }]} />
                </View>
            </View>
        </View>
    );

    const renderTransactionCard = (transaction) => (
        <View key={transaction._id} style={[styles.transactionCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
                    {transaction?.category}
                  {/* {truncateText(getTransactionType(transaction), 40)} */}
                </Text>
                <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                    {formatTransactionDate(transaction.createdAt)}
                </Text>
            </View>

            <Text style={[styles.recipientText, { color: theme.colors.text }]}>
             {truncateText(getTransactionType(transaction), 40)}
            </Text>

            <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
                    <Text style={[styles.detailValue, { 
                        color: getTransactionAmount(transaction).startsWith('+') ? '#4CAF50' : '#F44336' 
                    }]}>
                        {getTransactionAmount(transaction)}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Currency</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{transaction.currency}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Status</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(transaction.transactionStatus) }]}>
                        {transaction.transactionStatus}
                    </Text>
                </View>
                {transaction.metadata?.fee && (
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Fee</Text>
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            {transaction.currency === 'NPR' ? '₨' : '$'}{transaction.metadata.fee}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Header */}
            <View style={[styles.header, {}]}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
                </TouchableOpacity>
                {/* <Text style={[styles.headerTitle, { color: theme.colors.text }]}>History</Text> */}

            </View>

            <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>History</Text>
                    {isFilterActive && (
                        <View style={[styles.filterActiveIndicator, { backgroundColor: theme.colors.primary }]}>
                            <Text style={[styles.filterActiveText, { color: '#FFFFFF' }]}>Filtered</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={[styles.filterButton, isFilterActive && { backgroundColor: theme.colors.primary, borderRadius: 20 }]} onPress={handleFilterPress}>
                    <Image source={require('../../assets/Images/filters.png')} style={{ width: 20, height: 20, tintColor: isFilterActive ? '#FFFFFF' : undefined }} />
                    {/* <Text style={[styles.filterIcon, { color: theme.colors.primary }]}>⚙</Text> */}
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>

                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterTab,
                            {
                                backgroundColor: selectedFilter === filter
                                    ? (isDarkMode ? theme.colors.text : theme.colors.background)
                                    : 'transparent',
                                borderColor: theme.colors.border,
                            }
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    color: selectedFilter === filter
                                        ? (isDarkMode ? theme.colors.background : theme.colors.primary)
                                        : theme.colors.text,
                                }
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Transaction List */}
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
                        title="Pull to refresh"
                        titleColor={theme.colors.textSecondary}
                    />
                }
            >
                {isLoading ? (
                    // Show skeleton loading
                    Array.from({ length: 3 }).map((_, index) => (
                        <TransactionSkeleton key={index} />
                    ))
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
                            {error}
                        </Text>
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={fetchTransactions}
                        >
                            <Text style={[styles.retryButtonText, { color: theme.colors.primary }]}>
                                Retry
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : getFilteredTransactions().length > 0 ? (
                    getFilteredTransactions()?.map(renderTransactionCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            No {selectedFilter.toLowerCase()} transactions found
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Filter Modal */}
            <Modal
                visible={isFilterModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setIsFilterModalVisible(false)}
                    />
                    <View style={styles.modalContainer}>
                        {/* Grabber Handle */}
                        <View style={styles.modalGrabber} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter by Date</Text>
                        </View>

                        {/* Date Picker Row */}
                        <View style={styles.datePickerRow}>
                            {/* From Date Picker */}
                            <View style={styles.datePickerContainer}>
                                <Text style={styles.datePickerLabel}>From Date</Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => {
                                        console.log('From date button pressed');
                                        setShowFromDatePicker(true);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={fromDate ? styles.datePickerButtonText : styles.datePickerButtonPlaceholder}>
                                        {fromDate ? formatDateForDisplay(fromDate) : 'DD/MM/YYYY'}
                                    </Text>
                                    {fromDate && (
                                        <TouchableOpacity
                                            style={styles.clearDateButton}
                                            onPress={handleClearFromDate}
                                        >
                                            <Text style={styles.clearDateText}>✕</Text>
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>
                                {showFromDatePicker && (
                                    <DateTimePicker
                                        value={fromDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleFromDateChange}
                                        maximumDate={toDate || new Date()}
                                        style={{ backgroundColor: 'white' }}
                                    />
                                )}
                            </View>

                            {/* To Date Picker */}
                            <View style={styles.datePickerContainer}>
                                <Text style={styles.datePickerLabel}>To Date</Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => {
                                        console.log('To date button pressed');
                                        setShowToDatePicker(true);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={toDate ? styles.datePickerButtonText : styles.datePickerButtonPlaceholder}>
                                        {toDate ? formatDateForDisplay(toDate) : 'DD/MM/YYYY'}
                                    </Text>
                                    {toDate && (
                                        <TouchableOpacity
                                            style={styles.clearDateButton}
                                            onPress={handleClearToDate}
                                        >
                                            <Text style={styles.clearDateText}>✕</Text>
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>
                                {showToDatePicker && (
                                    <DateTimePicker
                                        value={toDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleToDateChange}
                                        maximumDate={new Date()}
                                        minimumDate={fromDate || new Date()}
                                        style={{ backgroundColor: 'white' }}
                                    />
                                )}
                            </View>
                        </View>

                        {/* Clear All Button */}
                        {(fromDate || toDate) && (
                            <TouchableOpacity
                                style={styles.clearAllButton}
                                onPress={handleClearAllDates}
                            >
                                <Text style={styles.clearAllButtonText}>Clear All Dates</Text>
                            </TouchableOpacity>
                        )}

                        {/* Clear Filters Button */}
                        <TouchableOpacity
                            style={[styles.clearAllButton, { marginBottom: 16 }]}
                            onPress={handleClearFilters}
                        >
                            <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
                        </TouchableOpacity>

                        {/* Submit Button with Gradient */}
                        <LinearGradient
                            colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1.5, y: 0.5 }}
                            style={styles.submitButton}
                        >
                            <TouchableOpacity
                                style={{ width: '100%', alignItems: 'center' }}
                                onPress={handleSubmitFilter}
                            >
                                <Text style={styles.submitButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CurrentHistory;
