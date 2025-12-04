import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const PhysicalCard = ({ navigation }) => {
  const { theme } = useTheme();
  const [cvv, setCvv] = useState('123');
  const [timeLeft, setTimeLeft] = useState(360); // 6 minutes in seconds
  const [isCardActive, setIsCardActive] = useState(false);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showActivateModal1, setShowActivateModal1] = useState(false);
  const [hasCardIssued, setHasCardIssued] = useState(false); // Default to false - no card issued

  const transactions = [
    {
      id: 1,
      type: 'send',
      icon: require("../assets/Images/trans.png"),
      recipient: 'UQ....R12F',
      time: '07:36 AM',
      amount: '1.1 BTC',
      status: 'Sended',
      statusColor: theme.colors.textSecondary,
    },
    {
      id: 2,
      type: 'receive',
      icon: require("../assets/Images/quick1.png"),
      recipient: 'EQ...If98',
      time: '8.12.23 07:36 AM',
      amount: '1.1 BTC',
      status: 'Received',
      statusColor: theme.colors.success,
    },
  ];

  const ActionButton = ({ icon, title, onPress, isActive = false, isDisabled = false }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          backgroundColor: isDisabled ? theme.colors.border : theme.colors.surface,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
        <Image source={icon} />
        {/* <Ionicons name={icon} size={20} color={theme.colors.primaryText} /> */}
      </View>
      <Text style={[styles.actionText, { color: theme.colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  const TransactionItem = ({ transaction, onPress, theme }) => (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={theme.colors.border} // soft highlight
      style={{ borderRadius: 8 }} // optional: round highlight edges
    >
      <View style={[styles.transactionItem, { backgroundColor: theme.colors.surface }]}>
        {/* Left section */}
        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIcon, {}]}>
            <Image
              source={transaction.icon}
              style={{ width: 35, height: 35, tintColor: theme.colors.primaryText }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={[styles.transactionType, { color: theme.colors.text }]}>
              {transaction.type === "send" ? "Send:" : "Deposit:"} {transaction.recipient}
            </Text>
            <Text style={[styles.transactionTime, { color: theme.colors.textSecondary }]}>
              {transaction.time}
            </Text>
          </View>
        </View>

        {/* Right section */}
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: theme.colors.text }]}>
            {transaction.type === "send" ? "-" : "+"} {transaction.amount}
          </Text>
          <Text style={[styles.transactionStatus, { color: transaction.statusColor }]}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  // Bottom Sheet Modal Component
  const ActivateCardModal = () => (
    <Modal
      visible={showActivateModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowActivateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowActivateModal(false)}
        />
        <View style={[styles.bottomSheet, { backgroundColor: theme.colors.surface }]}>
          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />

          {/* Modal Content */}
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Is your card with you?
            </Text>

            {/* Card Icon */}
            <View style={styles.cardIconContainer}>
              <Image source={require("../assets/Images/CardBlue.png")} style={{ resizeMode: 'contain', width: 65, height: 65 }} />
              {/* <View style={[styles.cardIcon, { backgroundColor: '#4A90E2' }]}>
                <View style={[styles.cardStripe, { backgroundColor: '#87CEEB' }]} />
                <View style={styles.cardChip}>
                  <View style={[styles.chipLines, { backgroundColor: '#2E5BBA' }]} />
                </View>
              </View> */}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => {
                setIsCardActive(true);
                setShowActivateModal(false);
                console.log('Card activated!');
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text style={[styles.activateButtonText, { color: "#fff" }]}>
                  Yes, Activate My Card
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notYetButton}
              onPress={() => setShowActivateModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.notYetText, { color: '#169BFF' }]}>
                Not Yet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const FrezeActivateCardModal = () => (
    <Modal
      visible={showActivateModal1}
      transparent
      animationType="fade"
      onRequestClose={() => setShowActivateModal1(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowActivateModal1(false)}
        />
        <View style={[styles.bottomSheet, { backgroundColor: theme.colors.surface }]}>
          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />

          {/* Modal Content */}
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Are you sure you want to delete your card?
            </Text>

            {/* Card Icon */}
            <View style={styles.cardIconContainer}>
              <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 22 }}>
                To send money you have to be friend, let them check their friend requests
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => {
                setIsCardActive(true);
                setShowActivateModal1(false);
                console.log('Card activated!');
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text style={[styles.activateButtonText, { color: "#fff" }]}>
                  No, Keep My Card
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notYetButton}
              onPress={() => setShowActivateModal1(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.notYetText, { color: '#FF1A1A' }]}>
                Delete Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal >
  );

  // Render No Card Issued View
  const renderNoCardIssued = () => (
    <View style={styles.noCardContainer}>
      <View style={styles.noCardContent}>
        {/* Icon or Image */}
        <View style={[styles.noCardIconContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="card-outline" size={64} color={theme.colors.textSecondary} />
        </View>
        
        {/* Title */}
        <Text style={[styles.noCardTitle, { color: theme.colors.text }]}>
          No Card Issued
        </Text>
        
        {/* Description */}
        <Text style={[styles.noCardDescription, { color: theme.colors.textSecondary }]}>
          You don't have a physical card yet. Apply now to get your card and start shopping online.
        </Text>
        
        {/* Apply Card Button */}
        <TouchableOpacity
          style={styles.applyCardButton}
          onPress={() => {
            // Navigate to ApplyCard screen
            navigation.navigate('ApplyCard');
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={[styles.applyCardButtonText, { color: "#fff" }]}>
              Apply Card
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={{ width: 24 }} />
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!hasCardIssued ? (
          // No Card Issued View
          renderNoCardIssued()
        ) : (
          // Card Issued View
          <>
            <View style={{ paddingVertical: 15 }}>
              <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
                Online Shopping
              </Text>
            </View>
            {/* Card Section */}
            <View style={[styles.cardContainer, {}]}>
              <Image source={require("../assets/Images/physical.png")} style={{ resizeMode: 'contain', width: width * 0.9, height: height * 0.3, borderRadius: 15 }} />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <View style={styles.actionRow}>
                <ActionButton
                  icon={require("../assets/Images/ActivatedICon.png")}
                  title="Activate Card"
                  onPress={() => setShowActivateModal(true)}
                  isActive={isCardActive}
                />
                <ActionButton
                  icon={require("../assets/Images/widthdraw.png")}
                  title="Add Money"
                  onPress={() => navigation.navigate("CardPassword")}
                />
              </View>
              <View style={styles.actionRow}>
                <ActionButton
                  icon={require("../assets/Images/FrezeICon.png")}
                  title="Freeze Card"
                  onPress={() => setShowActivateModal1(true)}
                  isActive={showActivateModal1}
                />
                {/* <ActionButton
                  icon={require("../assets/Images/widthdraw.png")}
                  title="Withdraw Money"
                  onPress={() => console.log('Withdraw pressed')}
                /> */}
              </View>
            </View>

            {/* Transactions Section */}
            <View style={[styles.transactionsSection, { backgroundColor: theme.colors.surface, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 15 }]}>
              <View style={styles.transactionsHeader}>
                <Text style={[styles.transactionsTitle, { color: theme.colors.text }]}>
                  Last 3 Transactions
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} theme={theme} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Activate Card Modal */}
      <ActivateCardModal />

      <FrezeActivateCardModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop:30
  },
  cardContainer: {
    // padding: 20,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  cardNumberSection: {
    marginBottom: 20,
  },
  cardNumberLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'System',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: 'System',
  },
  cvvSection: {
    marginBottom: 20,
  },
  cvvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cvvLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  cvvContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  cvvValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardholderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardholderName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
    fontFamily: 'System',
  },
  expiryDate: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 10,
    marginLeft: 4,
    fontFamily: 'System',
  },
  actionButtonsContainer: {
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
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
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    // fontFamily: 'System',
  },
  transactionsSection: {
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    paddingBottom: 10,
    paddingTop: 5
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
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'System',
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: 'System',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
    fontFamily: 'System',
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // paddingBottom: 34, // Safe area for home indicator
    margin: 18,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'System',
  },
  cardIconContainer: {
    marginBottom: 40,
  },
  cardIcon: {
    width: 80,
    height: 50,
    borderRadius: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardStripe: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardChip: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    width: 16,
    height: 12,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLines: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  activateButton: {
    width: '100%',
    // marginBottom: 16,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  notYetButton: {
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  notYetText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  // No Card Issued Styles
  noCardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.6,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  noCardIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  noCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'System',
  },
  noCardDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
    fontFamily: 'System',
  },
  applyCardButton: {
    width: '100%',
    maxWidth: 300,
  },
  applyCardButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
});

export default PhysicalCard;
