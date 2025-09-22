import React, { useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

const CurrentHistory = () => {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);


    // Sample transaction data
    const transactions = [
        {
            id: 1,
            type: 'Money Transfer',
            date: '2023-12-06 00:42:14',
            recipient: 'Sent to Swati',
            amount: '$62',
            shares: '3 Shares',
            fee: '$1.8',
            total: '$65',
            duration: 'Instant',
        },
        {
            id: 2,
            type: 'Money Transfer',
            date: '2023-12-06 00:42:14',
            recipient: 'Received From Abhi',
            amount: '$62',
            shares: '3 Shares',
            fee: '$1.8',
            total: '$65',
            duration: 'Instant',
        },
    ];

    const filters = ['All', 'Pending', 'Completed'];

    // Handler functions
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleFilterPress = () => {
        setIsFilterModalVisible(true);
    };

    const handleFromDateChange = (event, selectedDate) => {
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

    const handleSubmitFilter = () => {
        // Validate that if both dates are selected, fromDate is not after toDate
        if (fromDate && toDate && fromDate > toDate) {
            Alert.alert(
                'Invalid Date Range',
                'From date cannot be after to date. Please select valid dates.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Here you would typically filter the transactions based on the selected dates
        console.log('Filter from:', fromDate, 'to:', toDate);
        const fromDateStr = fromDate ? fromDate.toLocaleDateString() : 'No start date';
        const toDateStr = toDate ? toDate.toLocaleDateString() : 'No end date';
        Alert.alert(
            'Filter Applied',
            `Showing transactions from ${fromDateStr} to ${toDateStr}`,
            [{ text: 'OK', onPress: () => setIsFilterModalVisible(false) }]
        );
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
            fontSize: theme.typography.sizes.lg,
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
    });

    const renderTransactionCard = (transaction) => (
        <View key={transaction.id} style={[styles.transactionCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
                    {transaction.type}
                </Text>
                <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                    {transaction.date}
                </Text>
            </View>

            <Text style={[styles.recipientText, { color: theme.colors.text }]}>
                {transaction.recipient}
            </Text>

            <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{transaction.amount}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>To</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{transaction.shares}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Fee</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{transaction.fee}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Total USD</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{transaction.total}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Duration</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{transaction.duration}</Text>
                </View>
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
                <View>

                    <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>History</Text>
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                    <Image source={require('../../assets/Images/filters.png')} style={{ width: 20, height: 20, }} />
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
            >
                {transactions.map(renderTransactionCard)}
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
                                    onPress={() => setShowFromDatePicker(true)}
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
                                    onPress={() => setShowToDatePicker(true)}
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
