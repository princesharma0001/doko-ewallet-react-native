import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const NotificationList = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });


  useEffect(() => {
    loadNotifications();
  }, []);

  // Simple pulse animation for skeletons
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  // Load notifications when search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadNotifications();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadNotifications = async (page = 1, isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        setError(t('authenticationRequired'));
        return;
      }

      const response = await authService.getNotificationList(token, searchQuery, page, pagination.limit);

      if (response.success) {
        const mappedNotifications = response.data.map(notification => ({
          id: notification._id || notification.id,
          type: notification.type?.toLowerCase() || 'update',
          title: notification.title || 'Notification',
          message: notification.message || '',
          timestamp: notification.createdAt || new Date().toISOString(),
          isRead: notification.isRead || false,
          priority: notification.priority?.toLowerCase() || 'medium',
          icon: getIconForType(notification.type?.toLowerCase()),
          color: getColorForPriority(notification.priority?.toLowerCase()),
          data: notification.data || {},
        }));

        if (page === 1 || isRefresh) {
          setNotifications(mappedNotifications);
        } else {
          setNotifications(prev => [...prev, ...mappedNotifications]);
        }

        setPagination({
          page: response.page || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
          limit: response.limit || 10,
        });
      } else {
        setError(response.error || t('failedToLoadNotifications'));
        // Toast.show({
        //   type: 'error',
        //   text1: t('error'),
        //   text2: response.error || 'Failed to load notifications',
        //   position: 'top',
        //   visibilityTime: 3000,
        // });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(t('anErrorOccurredWhileLoading'));
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failedToLoadNotifications'),
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications(1, true);
    setRefreshing(false);
  };

  // Helper function to get icon based on notification type
  const getIconForType = (type) => {
    switch (type) {
      case 'update':
        return 'person-add';
      case 'transaction':
        return 'checkmark-circle';
      case 'security':
        return 'shield-checkmark';
      case 'system':
        return 'download';
      case 'marketing':
        return 'gift';
      case 'payment':
        return 'arrow-down-circle';
      case 'investment':
        return 'trending-up';
      default:
        return 'notifications';
    }
  };

  // Helper function to get color based on priority
  const getColorForPriority = (priority) => {
    switch (priority) {
      case 'high':
        return theme.colors.warning || '#FF6B6B';
      case 'medium':
        return theme.colors.primary || '#169BFF';
      case 'low':
        return theme.colors.info || '#6C757D';
      default:
        return theme.colors.primary || '#169BFF';
    }
  };

  const getFilteredNotifications = () => {
    // Since search is handled on the server side, we just return the notifications as is
    return notifications;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return `${diffInMinutes}${t('minutesAgo')}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${t('hoursAgo')}`;
    return `${Math.floor(diffInMinutes / 1440)}${t('daysAgo')}`;
  };

  const getIconComponent = (iconName, color) => {
    switch (iconName) {
      case 'checkmark-circle':
        return <Ionicons name="checkmark-circle" size={20} color={color} />;
      case 'gift':
        return <Ionicons name="gift" size={20} color={color} />;
      case 'shield-checkmark':
        return <Ionicons name="shield-checkmark" size={20} color={color} />;
      case 'download':
        return <Ionicons name="download" size={20} color={color} />;
      case 'arrow-down-circle':
        return <Ionicons name="arrow-down-circle" size={20} color={color} />;
      case 'trending-up':
        return <Ionicons name="trending-up" size={20} color={color} />;
      default:
        return <Ionicons name="notifications" size={20} color={color} />;
    }
  };

  const NotificationItem = ({ notification }) => (

    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: theme.colors.card,
          borderRadius: 12,
          marginBottom: 10
          // backgroundColor: notification.isRead ? theme.colors.surface : theme.colors.card,
          // borderLeftColor: notification.isRead ? 'transparent' : notification.color,
        },
      ]}
      onPress={() => markAsRead(notification.id)}
      activeOpacity={0.7}
    >
      {console.log("adgfsdagsad", notification)}
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: notification.color + '20' }]}>
          {getIconComponent(notification.icon, notification.color)}
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitle,
                {
                  color: theme.colors.text,
                  fontWeight: notification.isRead ? '500' : '700',
                },
              ]}
            >
              {notification.title}
            </Text>
            <Text style={[styles.itemTime, { color: theme.colors.textSecondary }]}>
              {getTimeAgo(notification.timestamp)}
            </Text>
          </View>
          <Text
            style={[
              styles.itemMessage,
              {
                color: theme.colors.textSecondary,
                opacity: notification.isRead ? 0.8 : 1,
              },
            ]}
          >
            {notification.message}
          </Text>
        </View>
      </View>
      {notification?.type === "new_friend_request" ?
        <View style={styles.itemRight}>
          <TouchableOpacity
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('dokoToken');
                if (!token) {
                  Toast.show({ type: 'error', text1: t('error'), text2: t('authenticationRequired'), position: 'top', visibilityTime: 2500 });
                  return;
                }
                const requesterId = notification?.id;
                if (!requesterId) {
                  Toast.show({ type: 'error', text1: t('error'), text2: t('requesterIdMissing'), position: 'top', visibilityTime: 2500 });
                  return;
                }
                const resp = await authService.acceptFriendRequest(requesterId, token);
                if (resp.success) {
                  Toast.show({ type: 'success', text1: t('success'), text2: resp.message || t('requestAccepted'), position: 'top', visibilityTime: 2500 });
                  onRefresh();
                } else {
                  Toast.show({ type: 'error', text1: t('error'), text2: resp.error || t('failedToAcceptRequest'), position: 'top', visibilityTime: 2500 });
                }
              } catch (e) {
                Toast.show({ type: 'error', text1: t('error'), text2: t('failedToAcceptRequest'), position: 'top', visibilityTime: 2500 });
              }
            }}
            style={styles.deleteButton}
          >
            <Ionicons name="checkmark" size={20} color={"#38C592"} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('dokoToken');
                if (!token) {
                  Toast.show({ type: 'error', text1: t('error'), text2: t('authenticationRequired'), position: 'top', visibilityTime: 2500 });
                  return;
                }
                const requesterId = notification?.id;
                if (!requesterId) {
                  Toast.show({ type: 'error', text1: t('error'), text2: t('requesterIdMissing'), position: 'top', visibilityTime: 2500 });
                  return;
                }
                const resp = await authService.rejectFriendRequest(requesterId, token);
                if (resp.success) {
                  Toast.show({ type: 'success', text1: t('success'), text2: resp.message || t('requestRejected'), position: 'top', visibilityTime: 2500 });
                  onRefresh();
                } else {
                  Toast.show({ type: 'error', text1: t('error'), text2: resp.error || t('failedToRejectRequest'), position: 'top', visibilityTime: 2500 });
                }
              } catch (e) {
                Toast.show({ type: 'error', text1: t('error'), text2: t('failedToRejectRequest'), position: 'top', visibilityTime: 2500 });
              }
            }}
            style={styles.deleteButton}
          >
            <Ionicons name="close" size={20} color={theme.colors.error} />
          </TouchableOpacity>

        </View> :

        notification?.type === "friend_request_rejected" ?

          <>
            <Ionicons name="close" size={25} color={theme.colors.error} />

          </> : null}

    </TouchableOpacity>
  );

  const SkeletonItem = () => (
    <View
      style={[
        styles.notificationItem,
        { backgroundColor: theme.colors.card, borderRadius: 12, marginBottom: 10 },
      ]}
    >
      <View style={styles.itemLeft}>
        <Animated.View
          style={[styles.iconContainer, { backgroundColor: theme.colors.border, opacity: pulse }]}
        />
        <View style={styles.itemContent}>
          <Animated.View
            style={[styles.skeletonLineLg, { backgroundColor: theme.colors.border, opacity: pulse }]}
          />
          <Animated.View
            style={[styles.skeletonLineSm, { backgroundColor: theme.colors.border, opacity: pulse }]}
          />
          <Animated.View
            style={[styles.skeletonParagraph, { backgroundColor: theme.colors.border, opacity: pulse }]}
          />
        </View>
      </View>
    </View>
  );


  // Show loading state only when initially loading and no data exists
  if (isLoading && notifications.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {t('notifications')}
          </Text>
          <TouchableOpacity onPress={async () => {
            try {
              const token = await AsyncStorage.getItem('dokoToken');
              if (!token) {
                Toast.show({ type: 'error', text1: t('error'), text2: t('authenticationRequired'), position: 'top', visibilityTime: 2500 });
                return;
              }
              const resp = await authService.clearNotifications(token);
              if (resp.success) {
                Toast.show({ type: 'success', text1: t('success'), text2: resp.message || t('cleared'), position: 'top', visibilityTime: 2500 });
                await loadNotifications(1, true);
              } else {
                Toast.show({ type: 'error', text1: t('error'), text2: resp.error || t('failedToClear'), position: 'top', visibilityTime: 2500 });
              }
            } catch (e) {
              Toast.show({ type: 'error', text1: t('error'), text2: t('failedToClearNotifications'), position: 'top', visibilityTime: 2500 });
            }
          }}>
            <Text style={[styles.markAllText, { color: theme.colors.primary }]}>
              {t('clearAll')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {/* <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder={t('searchNotifications')}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View> */}

        {/* Loading State - Skeletons */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonItem key={idx} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('notifications')}
        </Text>
        <TouchableOpacity onPress={async () => {
          try {
            const token = await AsyncStorage.getItem('dokoToken');
            if (!token) {
              Toast.show({ type: 'error', text1: t('error'), text2: t('authenticationRequired'), position: 'top', visibilityTime: 2500 });
              return;
            }
            const resp = await authService.clearNotifications(token);
            if (resp.success) {
              Toast.show({ type: 'success', text1: t('success'), text2: resp.message || t('cleared'), position: 'top', visibilityTime: 2500 });
              await loadNotifications(1, true);
            } else {
              Toast.show({ type: 'error', text1: t('error'), text2: resp.error || t('failedToClear'), position: 'top', visibilityTime: 2500 });
            }
          } catch (e) {
            Toast.show({ type: 'error', text1: t('error'), text2: t('failedToClearNotifications'), position: 'top', visibilityTime: 2500 });
          }
        }}>
          <Text style={[styles.markAllText, { color: theme.colors.primary }]}>
            {t('clearAll')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder={t('searchNotifications')}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>


      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonItem key={idx} />
            ))}
          </>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
              {t('errorLoadingNotifications')}
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
              {t('youHaveNoNotificationsYet')}
            </Text>

          </View>
        ) : getFilteredNotifications().length > 0 ? (
          <View style={[styles.notificationsContainer,]}>
            {getFilteredNotifications().map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
              {t('noDataFound')}
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
              {t('youHaveNoNotificationsYet')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'System',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  skeletonLineLg: {
    height: 14,
    borderRadius: 6,
    marginBottom: 8,
    width: width * 0.5,
  },
  skeletonLineSm: {
    height: 12,
    borderRadius: 6,
    marginBottom: 12,
    width: width * 0.3,
  },
  skeletonParagraph: {
    height: 36,
    borderRadius: 8,
    width: '95%',
  },
  notificationsContainer: {
    borderRadius: 16,
    paddingVertical: 8,
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    // borderLeftWidth: 3,
    marginBottom: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'System',
  },
  itemTime: {
    fontSize: 12,
    fontFamily: 'System',
  },
  itemMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'System',
  },
  itemRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'System',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default NotificationList;
