import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');

const CommunitySection = ({ onBackPress, onCreateChannel }) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('guide');

  const tabs = [
    { id: 'guide', label: t('guide') },
    { id: 'suggested', label: t('suggested') },
    { id: 'tips', label: t('tips') },
  ];

  const guideSteps = [
    {
      number: '1',
      title: t('selectAChannel'),
      description: t('chooseFromExistingChannels'),
    },
    {
      number: '2',
      title: t('createANewChannel'),
      description: t('ifYouCantFindWhatYoureLookingFor'),
    },
    {
      number: '3',
      title: t('participateInDiscussions'),
      description: t('onceYouveJoinedAChannel'),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    statusBar: {
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom:100
    },
    header: {
      paddingTop: 10,
      paddingBottom: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
      position: 'relative',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginTop: theme.spacing.md,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      // textAlign: 'center',
      flex: 1,
    },
    noChannelSection: {
      backgroundColor: theme.colors.surface,
      marginHorizontal:20,
      marginBottom:20,
      // margin:,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: 'center',
      position:'relative',
      height:height * 0.30,
      marginTop:20
    },
    bookmarkIcon: {
      // width: 60,
      // height: 60,
      // borderRadius: 30,
      // backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
      // justifyContent: 'center',
      // alignItems: 'center',
      // marginBottom: theme.spacing.lg,
      position:'absolute',
      top:-20
    },
    noChannelTitle: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    noChannelDescription: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight: 22,
    },
    createChannelButton: {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      width: '100%',
    },
    createChannelButtonText: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.medium,
      color: '#FFFFFF',
      textAlign: 'center',
      paddingVertical: theme.spacing.md,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.background,
    },
    tabText: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    inactiveTabText: {
      color: theme.colors.textSecondary,
    },
    contentContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    guideContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
    },
    guideStep: {
      marginBottom: theme.spacing.md,
    },
    guideStepNumber: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    guideStepTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    guideStepDescription: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    lastStep: {
      marginBottom: 0,
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'guide':
        return (
          <View style={styles.guideContainer}>
            {guideSteps.map((step, index) => (
              <View
                key={step.number}
                style={[
                  styles.guideStep,
                  index === guideSteps.length - 1 && styles.lastStep,
                ]}
              >
                {/* <Text style={styles.guideStepNumber}>{step.number}.</Text> */}
                <Text style={styles.guideStepTitle}>{step?.number}. {step.title}</Text>
                <Text style={styles.guideStepDescription}>{step.description}</Text>
              </View>
            ))}
          </View>
        );
      case 'suggested':
        return (
          <View style={styles.guideContainer}>
            <Text style={styles.guideStepTitle}>{t('suggestedChannels')}</Text>
            <Text style={styles.guideStepDescription}>
              {t('discoverPopularChannels')}
            </Text>
          </View>
        );
      case 'tips':
        return (
          <View style={styles.guideContainer}>
            <Text style={styles.guideStepTitle}>{t('communityTips')}</Text>
            <Text style={styles.guideStepDescription}>
              {t('learnBestPractices')}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

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
           
            <Text style={styles.headerTitle}>{t('community')}</Text>
          </View>
        </View>

        {/* No Channel Selected Section */}
        <View style={styles.noChannelSection}>
          <View style={styles.bookmarkIcon}>
            <Image source={require("../assets/Images/Bookmark.png")} style={{width:65,height:65, resizeMode:'contain'}} />
            {/* <Icon
              name="bookmark-border"
              size={24}
              color={theme.colors.primary}
            /> */}
          </View>
          <View style={{flex:1,width:"100%",paddingTop:35}}>

          <Text style={styles.noChannelTitle}>{t('noChannelSelected')}</Text>
          <Text style={styles.noChannelDescription}>
            {t('selectChannelFromListOrCreateNew')}
          </Text>
          <TouchableOpacity
            style={styles.createChannelButton}
            onPress={onCreateChannel}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createChannelButton}
            >
              <Text style={styles.createChannelButtonText}>{t('createChannel')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunitySection;
