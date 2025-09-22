import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const MySubscription = ({ navigation }) => {
  const { theme } = useTheme();

  const subscriptionFeatures = [
    {
      id: 'card-issued',
      title: 'Card issued',
      type: 'number',
      value: '3',
    },
    {
      id: 'free-virtual-cards',
      title: 'Free Virtual Cards',
      type: 'slider',
      current: 2,
      total: 3,
    },
    {
      id: 'no-commission-trades',
      title: 'No Commission Trades',
      type: 'slider',
      current: 2,
      total: 3,
    },
    {
      id: 'cashback-received-1',
      title: 'Cashback Received',
      type: 'number',
      value: '3',
    },
    {
      id: 'cashback-received-2',
      title: 'Cashback Received',
      type: 'number',
      value: '3',
    },
  ];

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );

  const renderProgressSlider = (current, total) => {
    const percentage = (current / total) * 100;
    
    return (
      <View style={styles.sliderContainer}>
        <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.sliderFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: theme.colors.primary 
              }
            ]} 
          />
          <View 
            style={[
              styles.sliderThumb, 
              { 
                left: `${percentage}%`,
                backgroundColor: theme.colors.primaryText 
              }
            ]} 
          />
        </View>
        <Text style={[styles.sliderText, { color: theme.colors.text }]}>
          {current}/{total}
        </Text>
      </View>
    );
  };

  const renderFeatureCard = (feature) => (
    <View 
      key={feature.id} 
      style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
    >
      <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
        {feature.title}
      </Text>
      
      {feature.type === 'number' ? (
        <Text style={[styles.featureValue, { color: theme.colors.text }]}>
          {feature.value}
        </Text>
      ) : feature.type === 'slider' ? (
        renderProgressSlider(feature.current, feature.total)
      ) : null}
    </View>
  );

  const renderSubscriptionFeatures = () => (
    <View style={styles.featuresContainer}>
      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Pro Subscription</Text>
      </View>
      {subscriptionFeatures.map(renderFeatureCard)}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderSubscriptionFeatures()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '700',
  },
  headerSpacer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  featureValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderTrack: {
    width: 80,
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
  },
  sliderText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
});

export default MySubscription;
