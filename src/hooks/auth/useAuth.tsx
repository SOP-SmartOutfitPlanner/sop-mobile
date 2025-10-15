import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutAPI } from "../../services/endpoint";

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  promptLogin: () => boolean;
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
        // User has valid token, set as authenticated
        // TODO: Optionally fetch user profile from API here
        setUser({
          id: userId,
          email: "", // Will be populated from API in future
          fullName: "User", // Will be populated from API in future
        });
      } else {
        // No token, user is not authenticated
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      // 1. Get Google OAuth token
      // 2. Send to backend API
      // 3. Save tokens to AsyncStorage
      // 4. Call checkAuthStatus()
      throw new Error("Google login not implemented yet");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();

      // Clear all tokens from AsyncStorage
      await AsyncStorage.multiRemove([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_ID_KEY,
      ]);

      console.log("✅ Logged out successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    } finally {
      setUser(null);
    }
  };

  const continueAsGuest = () => {
    // User continues without authentication
    setUser(null);
  };

  const promptLogin = (): boolean => {
    // Check if login is required (user is not authenticated)
    return !user;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // Simplified: user exists = authenticated
    isGuest: !user, // Simplified: no user = guest
    isLoading,
    logout,
    loginWithGoogle,
    continueAsGuest,
    promptLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
