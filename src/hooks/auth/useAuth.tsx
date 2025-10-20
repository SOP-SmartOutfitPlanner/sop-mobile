import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  use,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginAPI, logoutAPI, LoginGoogle } from "../../services/endpoint";
import {
  decodeJWT,
  extractAndSaveUserId,
  saveTokens,
} from "../../services/api/apiClient";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

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
  continueAsGuest: () => void;
  promptLogin: () => boolean;
  refreshAuthState: () => Promise<void>;
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

  // Check if user has valid token on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [accessToken, userId] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(USER_ID_KEY),
      ]);

      if (accessToken && userId) {
        setUser({
          id: userId,
          email: "",
          fullName: "User",
        });
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

      await saveTokens(accessToken, refreshToken);
      await extractAndSaveUserId(accessToken);
      await refreshAuthState();

      return decodedToken;
    } catch (error: any) {
      let errorMessage = "Đăng nhập thất bại";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Đăng nhập thất bại", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const loginWithGoogle = async (): Promise<DecodedToken> => {
    setIsLoading(true);
    try {
      console.log("🔄 Starting Google Sign-In...");

      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log("✅ Google Play Services available");

      // Perform Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      console.log("✅ Google userInfo:", userInfo);

      // Get the ID token from Google
      const idToken = userInfo.data?.idToken;
      console.log("📝 idToken:", idToken ? "Token received" : "Token missing");

      if (!idToken) {
        throw new Error("Không thể lấy ID token từ Google");
      }

      console.log("🔄 Sending token to backend...");

      // Call backend API with idToken
      const response = await LoginGoogle({ idToken });
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      // Decode token to check FirstTime
      const decodedToken = decodeJWT(accessToken);
      console.log("✅ Decode token:", decodedToken);

      // Save tokens and user info
      await saveTokens(accessToken, refreshToken);
      await extractAndSaveUserId(accessToken);
      await refreshAuthState();

      console.log("✅ Google login successful");
      // Return decoded token for navigation handling
      return decodedToken;
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "Đăng nhập với Google thất bại";

      // Handle specific Google Sign-In errors
      if (error.code === "SIGN_IN_CANCELLED") {
        errorMessage = "Đăng nhập bị hủy";
      } else if (error.code === "IN_PROGRESS") {
        errorMessage = "Đang xử lý đăng nhập...";
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        errorMessage = "Google Play Services không khả dụng";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Lỗi đăng nhập Google", errorMessage);
      throw error;
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
      // Always clear local storage and reset user state
      try {
        // Sign out from Google if user was signed in
        try {
          await GoogleSignin.signOut();
          console.log("✅ Google sign out successful");
        } catch (googleError) {
          // Ignore Google sign out errors (user might not be signed in via Google)
          console.log("ℹ️ Google sign out skipped:", googleError);
        }

        await AsyncStorage.multiRemove([
          ACCESS_TOKEN_KEY,
          REFRESH_TOKEN_KEY,
          USER_ID_KEY,
        ]);
        console.log("✅ Logged out successfully");
      } catch (storageError) {
        console.error("❌ Error clearing storage:", storageError);
      }
      setUser(null);
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
    continueAsGuest,
    promptLogin,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
