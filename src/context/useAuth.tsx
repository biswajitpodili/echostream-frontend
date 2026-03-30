import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
console.log("🌐 Auth Backend URL:", backendUrl);

// Types
export interface User {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar?: string;
  coverImage?: string;
  watchHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  userDetails: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, password: string, name: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Mock API functions (replace with real API calls)
const authAPI = {
  login: async (
    username: string,
    password: string
  ): Promise<{ user: User }> => {
    // Simulate API call
    const response = await fetch(`${backendUrl}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    console.log(data);

    return {
      user: data.data.user,
    };
  },

  logout: async (): Promise<void> => {
    // Make actual API call to logout
    const response = await fetch(`${backendUrl}/users/logout`, {
      method: "POST",
      credentials: "include", // This will send httpOnly cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Logout API call failed:", response.status);
      // Continue with local cleanup even if API call fails
    }
  },

  signup: async (
    username: string,
    password: string,
    name: string
  ): Promise<{ user: User }> => {
    const response = await fetch(`${backendUrl}/users/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        fullname: name,
        email: `${username}@example.com`, // You might want to make email a parameter too
      }),
    });

    if (!response.ok) {
      throw new Error(`Signup failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      user: data.data.user,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    console.log("🔍 Making getCurrentUser API call...");

    // Make actual API call to get current user
    const response = await fetch(`${backendUrl}/users/user-details`, {
      method: "GET",
      credentials: "include", // This will send httpOnly cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get current user: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    const user = data.data?.user || data.data;

    return user;
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${backendUrl}/users/update-user`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data.user || data.data;
  },
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: userData } = await authAPI.login(username, password);
      setUser(userData);
      // No need to store in localStorage - httpOnly cookies handle persistence
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (
    username: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await authAPI.signup(username, password, name);

      // Keep user unauthenticated after signup so login is explicit.
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Call backend logout to clear httpOnly cookies
      await authAPI.logout();

      // Clear local state
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout API fails, clear local state
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      setError(null);

      const updatedUser = await authAPI.updateUser(userData);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      if (!user) return;

      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      // No need to store in localStorage - httpOnly cookies handle persistence
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      // If refresh fails, user might need to login again
      setUser(null);
    }
  };

  // Clear error function
  const clearError = (): void => {
    setError(null);
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    userDetails: user, // Alias for backward compatibility
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    updateUser,
    refreshUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login or show login component
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default useAuth;
