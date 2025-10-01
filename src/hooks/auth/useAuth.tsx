import React, { createContext, useContext, useState, ReactNode } from "react";

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
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true); // Start as guest by default
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful login
      const mockUser: User = {
        id: "1",
        email,
        fullName: "User Demo",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      };

      setUser(mockUser);
      setIsGuest(false); // Clear guest mode when user logs in
    } catch (error) {
      throw new Error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful registration
      const mockUser: User = {
        id: "1",
        email,
        fullName,
      };

      setUser(mockUser);
      setIsGuest(false); // Clear guest mode when user registers
    } catch (error) {
      throw new Error("Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser: User = {
        id: "2",
        email: "user@gmail.com",
        fullName: "Google User",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      };

      setUser(mockUser);
      setIsGuest(false); // Clear guest mode when user logs in with Google
    } catch (error) {
      throw new Error("Đăng nhập với Google thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true); // Return to guest mode after logout
  };

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  const promptLogin = (): boolean => {
    // Return false if user is guest, indicating login is required
    // This function can be used to check if action requires authentication
    return !isGuest && !user;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isGuest,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    continueAsGuest,
    promptLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
