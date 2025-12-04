import axios from 'axios';
import ApiConfig from '../context/Endpoint';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// API service functions for authentication
export const authService = {
  // Check Account API call
  checkAccount: async (identity) => {
    try {
      const response = await apiClient.put(ApiConfig.checkAccount, { identity });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Account check failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Login API call
  login: async (identity, passcode) => {
    try {
      const response = await apiClient.post(ApiConfig.login, {
        identity,
        passcode,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
  // Signup API call
  signup: async (signupData) => {
    try {
      console.log('Calling signup API with data:', signupData);

      const response = await apiClient.post(ApiConfig.signup, signupData);

      console.log('Signup API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Signup API Error:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Signup failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Resend OTP API call
  resendOTP: async (identity) => {
    try {
      console.log('Calling resend OTP API with identity:', identity);

      const response = await apiClient.put(ApiConfig.resendOTP, { identity });

      console.log('Resend OTP API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Resend OTP API Error:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Resend OTP failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Verify OTP API call
  verifyOTP: async (identity, otp, otpType = null) => {
    try {
      console.log('Calling verify OTP API with identity:', identity, 'OTP:', otp, 'and otpType:', otpType);

      const requestData = {
        identity,
        otp
      };

      // Add otpType if provided
      if (otpType) {
        requestData.otpType = otpType;
      }
      console.log("Sdagasdg", requestData);


      const response = await apiClient.post(ApiConfig.verifyOTP, requestData);


      console.log('Verify OTP API response:', response);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Verify OTP API Error:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'OTP verification failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Update Profile API call
  updateProfile: async (profileData, token) => {
    try {
      console.log('Calling update profile API with data:', profileData);

      const response = await apiClient.put(ApiConfig.updateProfile, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Update profile API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Update profile API Error:', error?.response);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Profile update failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Create Passcode API call
  createPasscode: async (passcode, confirmPasscode, token) => {
    try {
      const response = await apiClient.post(
        ApiConfig.createPasscode,
        { passcode, confirmPasscode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Create passcode failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Profile API call
  getProfile: async (token) => {
    try {

      const response = await apiClient.get(ApiConfig.getProfile, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Profile API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Profile fetch failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Forgot Passcode API call
  forgotPasscode: async (identity) => {
    try {
      console.log('Calling forgot passcode API with identity:', identity);

      const response = await apiClient.post(ApiConfig.forgotPasscode, {
        identity,
      });

      console.log('Forgot passcode API response:', response);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Forgot Passcode API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Forgot passcode failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Delete Account API call
  deleteAccount: async (token) => {
    try {
      console.log('Calling delete account API');

      const response = await apiClient.delete(ApiConfig.deleteAccount, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete account API response:', response);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Delete Account API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Delete account failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Plans API call
  getPlans: async () => {
    try {
      console.log('Calling get plans API');

      const response = await apiClient.get(ApiConfig.getPlans);

      console.log('Get plans API response:', response);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Plans API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch plans';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Content API call
  getContent: async () => {
    try {
      console.log('Calling get content API');

      const response = await apiClient.get(ApiConfig.getContent);

      console.log('Get content API response:', response);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Content API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch content';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Purchase Subscription API call
  purchaseSubscription: async (planId, autoRenew = false, token) => {
    try {
      console.log('Calling purchase subscription API with planId:', planId, 'autoRenew:', autoRenew);

      const response = await apiClient.post(
        ApiConfig.purchaseSubscription,
        {
          planId,
          autoRenew,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Purchase subscription API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Purchase Subscription API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Subscription purchase failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Verify Payment API call
  verifyPayment: async (paymentIntentId, token) => {
    try {
      console.log('Calling verify payment API with paymentIntentId:', paymentIntentId);

      const response = await apiClient.post(
        ApiConfig.verifyPayment,
        {
          paymentIntentId: paymentIntentId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Verify payment API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Verify Payment API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Payment verification failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Active Subscription API call
  getActiveSubscription: async (token) => {
    try {

      const response = await apiClient.get(ApiConfig.getActiveSubscription, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Active Subscription API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch subscription details';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Cancel Subscription API call
  cancelSubscription: async (subscriptionId, cancelReason, token) => {
    try {
      console.log('Calling cancel subscription API with subscriptionId:', subscriptionId, 'reason:', cancelReason);

      const response = await apiClient.post(ApiConfig.cancelSubscription, {
        subscriptionId: subscriptionId,
        cancelReason: cancelReason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Cancel subscription API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Cancel Subscription API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to cancel subscription';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Wallet List API call
  getWalletList: async (token) => {
    try {
      const response = await apiClient.get(ApiConfig.getWalletList, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Wallet List API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch wallet list';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Initiate Deposit API call
  initiateDeposit: async (amount, description = "Wallet top-up", currency = "NPR", token) => {
    try {
      console.log('Calling initiate deposit API with amount:', amount, 'currency:', currency);

      const response = await apiClient.post(
        ApiConfig.initiateDeposit,
        {
          amount,
          description,
          currency,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Initiate deposit API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Initiate Deposit API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Deposit initiation failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Verify Deposit API call
  verifyDeposit: async (paymentIntentId, token) => {
    try {
      console.log('Calling verify deposit API with paymentIntentId:', paymentIntentId);

      const response = await apiClient.post(
        ApiConfig.verifyDeposit,
        {
          paymentIntentId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Verify deposit API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Verify Deposit API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Deposit verification failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Search Users API call
  searchUsers: async (searchQuery, token) => {
    try {
      console.log('Calling search users API with query:', searchQuery);

      const response = await apiClient.get(
        `${ApiConfig.searchUsers}?search=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Search users API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Search Users API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'User search failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Send Transfer API call
  sendTransfer: async (identity, amount, currency, notes, token) => {
    try {
      console.log('Calling send transfer API with:', { identity, amount, currency, notes });

      const response = await apiClient.post(
        ApiConfig.sendTransfer,
        {
          identity,
          amount,
          currency,
          notes,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Send transfer API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Send Transfer API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Transfer failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Transaction List API call
  getTransactionList: async (token, fromDate = null, toDate = null, type = 'all') => {
    try {
      console.log('Calling get transaction list API with dates:', {
        fromDate,
        toDate,
        fromDateType: typeof fromDate,
        toDateType: typeof toDate,
        fromDateIsDate: fromDate instanceof Date,
        toDateIsDate: toDate instanceof Date
      });

      // Build query parameters
      let queryParams = '';
      const params = [];

      // Add type parameter
      if (type && type !== 'all') {
        params.push(`type=${encodeURIComponent(type)}`);
        console.log('Added type parameter:', type);
      }

      if (fromDate) {
        let formattedFromDate;
        if (fromDate instanceof Date) {
          formattedFromDate = fromDate.toISOString().split('T')[0];
        } else if (typeof fromDate === 'string') {
          // Try to parse string date
          const dateObj = new Date(fromDate);
          if (!isNaN(dateObj.getTime())) {
            formattedFromDate = dateObj.toISOString().split('T')[0];
          }
        }

        if (formattedFromDate) {
          params.push(`fromDate=${encodeURIComponent(formattedFromDate)}`);
          console.log('Added fromDate parameter:', formattedFromDate);
        }
      }

      if (toDate) {
        let formattedToDate;
        if (toDate instanceof Date) {
          formattedToDate = toDate.toISOString().split('T')[0];
        } else if (typeof toDate === 'string') {
          // Try to parse string date
          const dateObj = new Date(toDate);
          if (!isNaN(dateObj.getTime())) {
            formattedToDate = dateObj.toISOString().split('T')[0];
          }
        }

        if (formattedToDate) {
          params.push(`toDate=${encodeURIComponent(formattedToDate)}`);
          console.log('Added toDate parameter:', formattedToDate);
        }
      }

      if (params.length > 0) {
        queryParams = '?' + params.join('&');
      }

      const response = await apiClient.get(
        `${ApiConfig.getTransactionList}${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Get transaction list API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Transaction List API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch transactions';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Send Friend Request API call
  sendFriendRequest: async (recipientId, token) => {
    try {
      console.log('Calling send friend request API with recipientId:', recipientId);

      const response = await apiClient.post(
        ApiConfig.friendRequest,
        {
          recipientId: recipientId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Send friend request API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Send Friend Request API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send friend request';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Notification List API call
  getNotificationList: async (token, searchQuery = null, page = 1, limit = 10) => {
    try {
      console.log('Calling get notification list API with search:', searchQuery, 'page:', page);

      // Build query parameters
      let queryParams = '';
      const params = [];

      if (searchQuery && searchQuery.trim()) {
        params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }

      if (page && page > 1) {
        params.push(`page=${page}`);
      }

      if (limit && limit !== 10) {
        params.push(`limit=${limit}`);
      }

      if (params.length > 0) {
        queryParams = '?' + params.join('&');
      }

      const response = await apiClient.get(
        `${ApiConfig.getNotificationList}${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Get notification list API response:', response.data);

      return {
        success: true,
        data: response.data.data?.docs || [],
        message: response.data.message,
        total: response.data.data?.total || 0,
        page: response.data.data?.page || 1,
        totalPages: response.data.data?.totalPages || 1,
        limit: response.data.data?.limit || 10,
      };
    } catch (error) {
      console.error('Get Notification List API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch notifications';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
  
  // Clear All Notifications API call
  clearNotifications: async (token) => {
    try {
      console.log('Calling clear notifications API');

      const response = await apiClient.get(
        ApiConfig.clearNotifications,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Clear notifications API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Clear Notifications API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to clear notifications';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
  
  // Accept Friend Request API call
  acceptFriendRequest: async (requesterId, token) => {
    try {
      console.log('Calling accept friend request API with requesterId:', requesterId);

      const response = await apiClient.put(
        ApiConfig.friendAccept,
        {
          notificationId: requesterId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Accept friend request API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Accept Friend Request API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to accept friend request';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Reject Friend Request API call
  rejectFriendRequest: async (requesterId, token) => {
    try {
      console.log('Calling reject friend request API with requesterId:', requesterId);

      const response = await apiClient.put(
        ApiConfig.friendReject,
        {
          notificationId: requesterId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Reject friend request API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Reject Friend Request API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to reject friend request';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
};


// Chat service functions
export const chatService = {
  // Create Group API call
  createGroup: async (groupData, token) => {
    try {
      console.log('Calling create group API with data:', groupData);

      const response = await apiClient.post('https://1f9dq437-8000.inc1.devtunnels.ms/api/v1/chat/create/group', groupData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Create group API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Create Group API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Group creation failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Create Individual Chat API call
  createIndividualChat: async (participantId, token) => {
    try {
      console.log('Calling create individual chat API with participantId:', participantId);

      const response = await apiClient.post(ApiConfig.createIndividualChat, {
        participantId: participantId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Create individual chat API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Create Individual Chat API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Individual chat creation failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Chat List API call
  getChatList: async (chatType, token, searchQuery = null) => {
    try {
      console.log('Calling get chat list API with type:', chatType, 'and search:', searchQuery);

      let url = ApiConfig.getChatList;
      const params = [];

      if (chatType && chatType !== 'all') {
        params.push(`chatType=${chatType}`);
      }

      if (searchQuery && searchQuery.trim()) {
        params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await apiClient.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Get chat list API response:', response.data);

      return {
        success: true,
        data: response.data.data?.docs || [],
        message: response.data.message,
        total: response.data.data?.total || 0,
      };
    } catch (error) {
      console.error('Get Chat List API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch chat list';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Send Message API call
  sendMessage: async (messageData, token) => {
    try {
      console.log('Calling send message API with data:', messageData);

      const response = await apiClient.post(ApiConfig.sendMessage, messageData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Send message API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Send Message API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send message';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Get Message List API call
  getMessageList: async (chatId, token) => {
    console.log("sdagsadgsad", chatId);

    try {
      console.log('Calling get message list API with chatId:', chatId);

      const response = await apiClient.get(
        `${ApiConfig.getMessageList}?chatId=${chatId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Get message list API response:', response.data);

      return {
        success: true,
        data: response.data.data?.docs || [],
        message: response.data.message,
        total: response.data.data?.total || 0,
        page: response.data.data?.page || 1,
        totalPages: response.data.data?.totalPages || 1,
      };
    } catch (error) {
      console.error('Get Message List API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch messages';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Send Payment Split API call
  sendPaymentSplit: async (paymentData, token) => {
    try {
      console.log('Calling send payment split API with data:', paymentData);

      const response = await apiClient.post(ApiConfig.sendPaymentSplit, paymentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Send payment split API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Send Payment Split API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send payment split';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  //Seperate function 

  seprarentPayment: async (paymentData, token) => {
    try {
      console.log('Calling send payment split API with data:', paymentData);

      const response = await apiClient.post(ApiConfig.sepratPyament, paymentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Send payment split API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Send Payment Split API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send payment split';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Accept Payment API call
  acceptPayment: async (paymentId, token) => {
    try {
      console.log('Calling accept payment API with paymentId:', paymentId);

      const response = await apiClient.post(ApiConfig.acceptPayment, { paymentId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Accept payment API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Accept Payment API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to accept payment';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Decline Payment API call
  declinePayment: async (paymentId, reason, token) => {
    try {
      console.log('Calling decline payment API with paymentId:', paymentId, 'reason:', reason);

      const response = await apiClient.post(ApiConfig.declinePayment, {
        paymentId,
        reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Decline payment API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Decline Payment API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to decline payment';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
};

// Bank service functions
export const bankService = {
  // Get Bank Details API call
  getBankDetails: async (bankType, token) => {
    try {
      console.log('Calling get bank details API with bankType:', bankType);

      // const response = await apiClient.get(
      //   `${ApiConfig.getBankDetails}?bankType=${bankType.toLowerCase()}`,
      // );

      const response = await apiClient.get(
        `${ApiConfig.getBankDetails}?bankType=${bankType.toLowerCase()}&currency=NPR`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );



      console.log('Get bank details API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get Bank Details API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch bank details';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
};

// User settings service functions
export const userSettingsService = {
  // Get User Settings API call
  getUserSettings: async (token) => {
    try {
      console.log('Calling get user settings API');

      const response = await apiClient.get(ApiConfig.getUserSettings, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Get user settings API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get User Settings API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch user settings';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Update User Settings API call
  updateUserSettings: async (settingsData, token) => {
    try {
      console.log('Calling update user settings API with data:', settingsData);

      const response = await apiClient.put(ApiConfig.updateUserSettings, settingsData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Update user settings API response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Update User Settings API Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to update user settings';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // Start KYC process and fetch SumSub access token
  startKyc: async () => {
    try {
      const response = await apiClient.post(ApiConfig.startKyc, {});
      const payload = response.data || {};
      console.log("sadsfghfdgsfs",payload);
      
      return {
        success: payload.error === false || payload.error === 'false',
        data: payload.data,
        message: payload.message,
      };
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 'KYC start failed';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },
};

// Transaction history service
export const transactionHistoryService = {
  // GET /transactionHistory/list (optionally with ?filterUserId=...)
  getUserTransactionHistory: async (filterUserId, token) => {
    try {
      const url = filterUserId
        ? `${ApiConfig.getUserTransactionHistory}?filterUserId=${encodeURIComponent(
            filterUserId,
          )}`
        : ApiConfig.getUserTransactionHistory;
      const response = await apiClient.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = response.data?.data || {};
      return {
        success: true,
        data,
        docs: data.docs || [],
        stats: data.stats || {},
        message: response.data?.message,
      };
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch transaction history';
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - Please check your internet connection',
        };
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }
  },

  // GET /transactionHistory/list?isCircle=true
  getCircleTransactionHistory: async (token) => {
    try {
      const url = `${ApiConfig.getUserTransactionHistory}?isCircle=true`;
      const response = await apiClient.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = response.data?.data || {};
      return {
        success: true,
        data,
        docs: data.docs || [],
        stats: data.stats || {},
        message: response.data?.message,
      };
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          "Failed to fetch circle transaction history";
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        return {
          success: false,
          error: "Network error - Please check your internet connection",
        };
      } else {
        return {
          success: false,
          error: error.message || "An unexpected error occurred",
        };
      }
    }
  },
};
