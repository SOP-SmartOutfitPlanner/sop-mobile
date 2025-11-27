import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginAPI,
  logoutAPI,
  LoginGoogle,
  registerAPI,
} from "../../services/endpoint";
import {
  decodeJWT,
  extractAndSaveUserId,
  getUserId,
  saveTokens,
} from "../../services/api/apiClient";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getUserProfile } from "../../services/endpoint/user";
import { User } from "../../types/user";
import { usePushToken } from "../notification/usePushToken";

interface DecodedToken {
  FirstTime: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<DecodedToken>;
  loginWithGoogle: () => Promise<DecodedToken>;
  register: (data: {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
  }) => Promise<any>;
  continueAsGuest: () => void;
  promptLogin: () => boolean;
  refreshAuthState: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const ACCESS_TOKEN_KEY = "@sop_access_token";
const REFRESH_TOKEN_KEY = "@sop_refresh_token";
const USER_ID_KEY = "@sop_user_id";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check token
  const { registerDevice, unregisterDevice } = usePushToken();

  const syncDeviceToken = useCallback(async () => {
    try {
      const userIdString = await getUserId();
      if (!userIdString) {
        return;
      }
      const userId = Number(userIdString);
      if (Number.isNaN(userId)) {
        return;
      }
      await registerDevice(userId);
    } catch (error) {
      console.error("❌ Failed to sync device token:", error);
    }
  }, [registerDevice]);

  const clearSession = useCallback(async () => {
    try {
      await unregisterDevice();
    } catch (deviceError) {
      console.error("❌ Error unregistering device:", deviceError);
    }

    try {
      await GoogleSignin.signOut();
    } catch (googleError) {
      console.log("ℹ️ Google sign out skipped:", googleError);
    }

    try {
      await AsyncStorage.multiRemove([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_ID_KEY,
      ]);
    } catch (storageError) {
      console.error("❌ Error clearing storage:", storageError);
    }

    setUser(null);
  }, [unregisterDevice]);

  const handleSessionExpired = useCallback(async () => {
    console.log("⚠️ Session expired, clearing credentials");
    await clearSession();
  }, [clearSession]);

  // Load user profile from API
  const loadUserProfile = async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        // console.log("⚠️ No userId found in storage");
        return;
      }

      // console.log("🔄 Loading user profile for userId:", userId);
      const response = await getUserProfile(Number(userId));

      if (response.statusCode === 200) {
        setUser(response.data);
      } else {
        console.error(
          "❌ Failed to load profile, status:",
          response.statusCode
        );
        if (response.statusCode === 401 || response.statusCode === 403) {
          await handleSessionExpired();
        }
      }
    } catch (error: any) {
      console.error("❌ Error loading user profile:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      if (
        status === 401 ||
        status === 403 ||
        (typeof message === "string" &&
          message.toLowerCase().includes("token not valid"))
      ) {
        await handleSessionExpired();
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      const [accessToken, userId] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(USER_ID_KEY),
      ]);

      if (accessToken && userId) {
        // Load full user profile
        await loadUserProfile();
        await syncDeviceToken();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has valid token on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Expose checkAuthStatus so screens can refresh auth state after login
  const refreshAuthState = async () => {
    await checkAuthStatus();
  };

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<DecodedToken> => {
    setIsLoading(true);
    try {
      const response = await loginAPI(credentials);
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      const decodedToken = decodeJWT(accessToken);
      // console.log(" Decode token:", decodedToken);
      // console.log(" accessToken token:", accessToken);
      await saveTokens(accessToken, refreshToken);
      await extractAndSaveUserId(accessToken);
      await syncDeviceToken();
      await refreshAuthState();

      return decodedToken;
    } catch (error: any) {
      let errorMessage = "Login failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Don't show Alert here - let the screen handle it with notification
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const loginWithGoogle = async (): Promise<DecodedToken> => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken;
      // console.log("idToken:", idToken);
      if (!idToken) {
        throw new Error("Không thể lấy ID token từ Google");
      }
      const response = await LoginGoogle(idToken);
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const decodedToken = decodeJWT(accessToken);
      // console.log("✅ Decode token:", decodedToken);
      // Save tokens and user info
      await saveTokens(accessToken, refreshToken);
      await extractAndSaveUserId(accessToken);
      await syncDeviceToken();
      await refreshAuthState();
      return decodedToken;
    } catch (error: any) {
      let errorMessage = "Login with Google failed";
      // Handle specific Google Sign-In errors
      if (error.code === "SIGN_IN_CANCELLED") {
        errorMessage = "Login cancelled";
      } else if (error.code === "IN_PROGRESS") {
        errorMessage = "Login in progress...";
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        errorMessage = "Google Play Services not available";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await registerAPI(data);
      return response;
    } catch (error: any) {
      let errorMessage = "Registration failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Don't show Alert here - let the screen handle it with notification
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try to call logout API, but don't fail if token is expired (401)
      await logoutAPI();
    } catch (error: any) {
      // Ignore 401 errors (token already expired)
      if (error?.response?.status !== 401) {
        console.error("❌ Logout error:", error);
      } else {
        console.log("ℹ️ Token already expired, clearing local data");
      }
    } finally {
      await clearSession();
      console.log("✅ Logged out successfully");
    }
  };

  const continueAsGuest = () => {
    setUser(null);
  };

  const promptLogin = (): boolean => {
    return !user;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isGuest: !user,
    isLoading,
    logout,
    login,
    loginWithGoogle,
    register,
    continueAsGuest,
    promptLogin,
    refreshAuthState,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
