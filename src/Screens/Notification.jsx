import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Notification = ({ navigation }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState({
    marketingOffers: true,
    transactions: false,
    investmentNews: true,
  });

  const notificationItems = [
    {
      id: 'marketingOffers',
      icon: 'percent',
      title: 'Marketing Offers',
      description: "I accept to recieve emails about DOKO's services and products that may benefit me in the future.",
      isEnabled: notifications.marketingOffers,
    },
    {
      id: 'transactions',
      icon: 'swap-horizontal',
      title: 'Transactions',
      description: 'I accept to receive notifications regarding all transactions.',
      isEnabled: notifications.transactions,
    },
    {
      id: 'investmentNews',
      icon: 'trending-up',
      title: 'Investment News',
      description: 'I accept to receive emails and in-app notifications of investment.',
      isEnabled: notifications.investmentNews,
    },
  ];

  const handleToggle = (id) => {
    setNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'percent':
        return <Text style={[styles.iconText, { color: theme.colors.primaryText }]}>%</Text>;
      case 'swap-horizontal':
        return <Ionicons name="swap-horizontal" size={20} color={theme.colors.primaryText} />;
      case 'trending-up':
        return <Ionicons name="trending-up" size={20} color={theme.colors.primaryText} />;
      default:
        return <Ionicons name="notifications" size={20} color={theme.colors.primaryText} />;
    }
  };

  const NotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
          {getIconComponent(item.icon)}
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          
          <Text  style={[styles.itemDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
      <Switch
        value={item.isEnabled}
        onValueChange={() => handleToggle(item.id)}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary + '40',
        }}
        thumbColor={item.isEnabled ? theme.colors.primary : theme.colors.textSecondary}
        ios_backgroundColor={theme.colors.border}
        style={styles.toggleSwitch}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
          Notifications
        </Text>
        <View style={[styles.notificationsContainer, { backgroundColor: theme.colors.surface }]}>
          {notificationItems.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))}
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
  },
  notificationsContainer: {
    borderRadius: 16,
    paddingVertical: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'System',
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'System',
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    marginRight:40
  },
});

export default Notification;
