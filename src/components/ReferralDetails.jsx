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
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ReferralDetails = ({ route }) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();

  // Mock data - replace with actual data from route params or API
  const inviteData = {
    invitee: {
      name: 'Faizan Danish',
      initials: 'FD',
      status: 'Pending',
      amount: '$50',
    },
    completedSteps: [
      t('letYourFriendsDownloadTheAppFromAppStore'),
      t('pressOnTheLinkProvidedByYou'),
      t('letThemVerifyTheirAccount'),
      t('convinceThemToSubscribeToDoko'),
      t('makeThemCompleteTheirPaymentOfSubscription'),
    ],
  };

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
      // textAlign: 'center',
    },
    inviteeCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

    },
    inviteeAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#169BFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    inviteeInitials: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: '#FFFFFF',
    },
    inviteeInfo: {
      flex: 1,
      alignItems: 'flex-end',
    },
    inviteeName: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      // marginBottom: theme.spacing.md,
      paddingTop:10
    },
    inviteeStatus: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'right',
    },
    inviteeAmount: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      textAlign: 'right',
    },
    completionSection: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    completionTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    completionStepsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    completionStep: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      paddingLeft: theme.spacing.sm,
    },
    completionStepNumber: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
      minWidth: 20,
    },
    completionStepText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 20,
    },
    lastStep: {
      marginBottom: 0,
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

          <Text style={styles.headerTitle}>{t('yourInvite')}</Text>
        </View>

        {/* Invitee Details Card */}
        <View style={styles.inviteeCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{}}>
              <View style={styles.inviteeAvatar}>
                <Text style={styles.inviteeInitials}>{inviteData.invitee.initials}</Text>
              </View>
              <Text style={styles.inviteeName}>{inviteData.invitee.name}</Text>
            </View>

            <View style={styles.inviteeInfo}>
              <Text style={styles.inviteeStatus}>{t('pending')}</Text>
              <Text style={styles.inviteeAmount}>{inviteData.invitee.amount}</Text>
            </View>
          </View>
        </View>

        {/* Completion Steps Section */}
        <View style={styles.completionSection}>
          <Text style={styles.completionTitle}>
            {t('whatYourInviteHasCompleted')}
          </Text>

          <View style={styles.completionStepsCard}>
            {inviteData.completedSteps.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.completionStep,
                  index === inviteData.completedSteps.length - 1 && styles.lastStep,
                ]}
              >
                <Text style={styles.completionStepNumber}>{index + 1}.</Text>
                <Text style={styles.completionStepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralDetails;
