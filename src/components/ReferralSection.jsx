import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ReferralSection = ({ onBackPress, onSendLink }) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();
  // Mock data - replace with actual data from props or state
  const referralData = {
    timeLeft: '100 days',
    earnedAmount: '$0',
    pendingAmount: '$100',
    friends: [
      { id: 1, initials: 'FD', completion: 80 },
      { id: 2, initials: 'FD', completion: 60 },
    ],
  };

  const instructions = [
    t('letYourFriendsDownloadTheApp'),
    t('pressOnTheLinkProvided'),
    t('letThemVerifyTheirAccount'),
    t('convinceThemToSubscribeToDoko'),
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    },
    statusBar: {
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 100,
    },
    header: {
      paddingTop: 10,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: 10,
      position: 'relative',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 35,
    },
    offerSummaryCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
    },
    timeLeftLabel: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
      fontWeight: '500'
    },
    timeLeftValue: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center'

    },
    allActionsText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center'

    },
    instructionsSection: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    instructionsTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    instructionItem: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      paddingLeft: theme.spacing.sm,
    },
    instructionNumber: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
      minWidth: 20,
    },
    instructionText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    progressSection: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    invitesText: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    pendingAmount: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: '#169BFF', // Blue color for pending amount
    },
    friendsContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 12,
      gap: 12
    },
    friendAvatar: {
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: '#169BFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    friendInitials: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: '#FFFFFF',
    },
    completionText: {
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: '#38C592', // Green color for completion
      textAlign: 'center',
    },
    sendLinkButton: {
      paddingHorizontal: 20,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.xl,
    },
    sendLinkButtonText: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: '#FFFFFF',
      textAlign: 'center',
      paddingVertical: 14,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon
                name="arrow-back"
                size={28}
                color={theme.colors.text}
              />
            </TouchableOpacity>

          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={styles.headerTitle}>{t('earnFiftyDollarsForEveryInvite')}</Text>
        </View>

        <View style={styles.offerSummaryCard}>
          <Text style={styles.timeLeftLabel}>{t('timeLeft')}</Text>
          <Text style={styles.timeLeftValue}>{referralData.timeLeft}</Text>
          <Text style={styles.allActionsText}>
            {t('allActionsBelowMustBeCompleted')}
          </Text>
        </View>

        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>
            {t('whatMyInvitedFriendsNeedToDo')}
          </Text>
          <View style={{ backgroundColor: theme.colors.surface, paddingHorizontal: 14, paddingTop: 20, paddingBottom: 8, borderRadius: 15 }}>

            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}.</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Referral Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.invitesText}>
              {t('invitesEarned').replace('{amount}', referralData.earnedAmount)}
            </Text>
            <Text style={styles.pendingAmount}>
              {referralData.pendingAmount} {t('pending')}
            </Text>
          </View>

          <View style={styles.friendsContainer}>
            {referralData.friends.map((friend) => (
              <TouchableOpacity key={friend.id} onPress={() => navigation.navigate("ReferralDetails")} style={{ alignItems: 'center' }}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendInitials}>{friend.initials}</Text>
                </View>
                <Text style={styles.completionText}>
                  {friend.completion}% {t('completed')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Send Link Button */}
        <TouchableOpacity
          style={styles.sendLinkButton}
          onPress={onSendLink}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 0.5 }}
            style={styles.sendLinkButton}
          >
            <Text style={styles.sendLinkButtonText}>{t('sendALink')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralSection;
