import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');

const WesternUnionPreview = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();

  // Get data from previous screen or use default values
  const formData = route?.params?.formData || {
    beneficiaryName: 'Faizan Danish',
    beneficiaryAddress: 'New Delhi India',
    country: 'India',
    swiftCode: 'SBIN0004895',
    amount: '350',
    phoneNumber: '+91 9876543210',
    currency: 'USD',
    reason: 'Shopping',
  };

  // Calculate fees (example: 1.6% of amount)
  const amount = parseFloat(formData.amount) || 0;
  const feePercentage = 1.6;
  const feeAmount = (amount * feePercentage / 100).toFixed(2);
  const totalAmount = (amount + parseFloat(feeAmount)).toFixed(2);

  // Handle send now action
  const handleSendNow = () => {
  navigation.navigate('WestrenThanku')
  };

  // Detail row component
  const DetailRow = ({ label, value, isLast = false }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailContent}>
        <Text
          style={[
            styles.detailLabel,
            {
              color: isDarkMode ? '#9E9E9E' : '#6C757D',
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.sizes.md,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.detailValue,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
            },
          ]}
        >
          {value}
        </Text>
      </View>
      {!isLast && (
        <View
          style={[
            styles.separator,
            { backgroundColor: isDarkMode ? '#464665' : '#E9ECEF' },
          ]}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.headerButton,
            // { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
          ]}
        >
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.sizes.xxl,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            Preview Details
          </Text>
        </View>

        {/* Beneficiary and Transaction Details */}
        <View
          style={[
            styles.detailsSection,
            {
              backgroundColor: theme.colors.surface,
              // borderColor: isDarkMode ? '#464665' : '#E9ECEF',
            },
          ]}
        >
          <DetailRow label="Beneficiary Name" value={formData.beneficiaryName} />
          <DetailRow label="Beneficiary Address" value={formData.beneficiaryAddress} />
          <DetailRow label="IBAN Number" value="123465798" />
          <DetailRow label="Beneficiary Bank" value="SBI" />
          <DetailRow label="Bank Address" value="Saunda" />
          <DetailRow label="Nation" value="Delhi" />
          <DetailRow label="Swift Code" value={formData.swiftCode} />
          <DetailRow label="Other Details" value="NA" />
          <DetailRow label="Reason and Purpose" value={formData.reason} isLast={true} />
        </View>

        {/* Amount and Fee Details */}
        <View
          style={[
            styles.amountSection,
            {
              backgroundColor: theme.colors.surface,
              // borderColor: isDarkMode ? '#464665' : '#E9ECEF',
            },
          ]}
        >
          <DetailRow
            label="Amount"
            value={`${formData.currency} ${formData.amount}`}
          />
          <DetailRow
            label="DOKO Fee"
            value={`${feePercentage}% X ${formData.amount}`}
            isLast={true}
          />
        </View>
      </ScrollView>

      {/* Send Now Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendNow}
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
                styles.sendButtonText,
                {
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              Send Now
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    // textAlign: 'center',
    letterSpacing: 0.5,
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 10,

    // borderWidth: 1,
    overflow: 'hidden',
  },
  amountSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 10,
    // borderWidth: 1,
    overflow: 'hidden',
  },
  detailRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    flex: 1,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    marginTop: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default WesternUnionPreview;
