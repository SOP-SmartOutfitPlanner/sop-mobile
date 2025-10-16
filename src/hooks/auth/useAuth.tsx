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

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      throw new Error("Google login not implemented yet");
    } catch (error) {
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
    loginWithGoogle,
    continueAsGuest,
    promptLogin,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
