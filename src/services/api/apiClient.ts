import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Storage Keys
const ACCESS_TOKEN_KEY = "@sop_access_token";
const REFRESH_TOKEN_KEY = "@sop_refresh_token";
const USER_ID_KEY = "@sop_user_id";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag to prevent multiple refresh token calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth endpoints (login, register, etc) - they don't need token
    const authEndpoints = ["/auth", "/auth/register", "/auth/otp/verify", "/auth/otp/resend","/auth/password/forgot","/auth/password/reset", "/auth/password/verify-otp", "/auth/login/google/oauth"];
    const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Only add token for non-auth endpoints
    if (!isAuthEndpoint) {
      // Get access token from storage
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

      // Add token to headers if exists (with Bearer prefix)
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
    }

    // Log request in development
    if (__DEV__) {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        hasToken: !!config.headers?.Authorization,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log("✅ API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if this is a logout endpoint with 401 - this is expected behavior
    const isLogoutWith401 = originalRequest?.url?.includes("/auth/logout") && error.response?.status === 401;

    // Log error in development (skip expected logout 401)
    if (__DEV__ && !isLogoutWith401) {
      console.error("❌ API Error:", {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - Token expired
    // Skip refresh token logic for auth endpoints (login, register, logout, etc)
    const authEndpoints = ["/auth", "/auth/register", "/auth/otp/verify", "/auth/otp/resend","/auth/password/forgot","/auth/password/reset", "/auth/password/verify-otp", "/auth/login/google/oauth"];
    const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          console.warn("⚠️ No refresh token available in storage");
          throw new Error("No refresh token available");
        }

        console.log("🔄 Attempting to refresh token...");
        console.log("🔑 Refresh token exists:", !!refreshToken);
        
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          JSON.stringify(refreshToken),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Token refresh response received:", response.data);

        // Extract tokens from response.data.data (API structure)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Save new tokens
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        console.log("✅ New tokens saved successfully");

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed - clear tokens (app will handle navigation)
        console.error("❌ Token refresh failed:", {
          message: refreshError?.message,
          response: refreshError?.response?.data,
          status: refreshError?.response?.status,
        });
        
        processQueue(refreshError, null);
        await clearTokens();

        console.log("🔒 Session expired, tokens cleared - user needs to login again");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// Token Management Functions
export const saveTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
    // console.log("✅ Tokens saved successfully");
  } catch (error) {
    console.error("❌ Error saving tokens:", error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("❌ Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("❌ Error getting refresh token:", error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY]);
    console.log("✅ Tokens cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing tokens:", error);
    throw error;
  }
};

// JWT Decode Function 
export const decodeJWT = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("❌ Error decoding JWT:", error);
    throw error;
  }
};

// User ID Management Functions
export const saveUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
    // console.log("✅ User ID saved successfully:", userId);
  } catch (error) {
    console.error("❌ Error saving user ID:", error);
    throw error;
  }
};

export const getUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error("❌ Error getting user ID:", error);
    return null;
  }
};

// Extract and save userId from accessToken
export const extractAndSaveUserId = async (accessToken: string): Promise<string> => {
  try {
    const decoded = decodeJWT(accessToken);
    
    // Extract userId from JWT payload
    // Based on your token structure: "UserId": "12"
    const userId = decoded.UserId || decoded.userId || decoded.sub;
    
    if (!userId) {
      throw new Error('UserId not found in token');
    }

    // Save userId to AsyncStorage
    await saveUserId(userId);
    
    // console.log("✅ UserId extracted and saved:", userId);
    return userId;
  } catch (error) {
    console.error("❌ Error extracting userId:", error);
    throw error;
  }
};

// API Client Export
export default apiClient;
