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
      console.log("Sdagasdg",requestData);
      
      
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
      console.log('Calling get profile API');

      const response = await apiClient.get(ApiConfig.getProfile, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Get profile API response:', response.data);

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
};
