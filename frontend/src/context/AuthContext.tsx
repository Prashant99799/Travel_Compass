import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// API Base URL - Use relative path for Vite proxy in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  is_native: boolean;
  preferences: Record<string, unknown>;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'compass_token';
const USER_KEY = 'compass_user';

// API Helper with auth
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract error message from various response formats
      const errorMessage = data.error?.message || data.error || data.message || 'Request failed';
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Verify token is still valid
        const result = await apiRequest<{ user: User }>('/auth/me', {}, storedToken);
        if (result.success && result.data) {
          setUser(result.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
        } else {
          // Token invalid, clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    const result = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      const { user: loggedInUser, token: newToken } = result.data;
      setUser(loggedInUser);
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      setIsLoading(false);
      return { success: true, message: 'Login successful!' };
    }

    setIsLoading(false);
    return { success: false, message: result.error || 'Login failed' };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    const result = await apiRequest<{ user: User; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (result.success && result.data) {
      const { user: newUser, token: newToken } = result.data;
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, message: 'Account created successfully!' };
    }

    setIsLoading(false);
    return { success: false, message: result.error || 'Signup failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const result = await apiRequest<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);

    if (result.success && result.data) {
      setUser(result.data);
      localStorage.setItem(USER_KEY, JSON.stringify(result.data));
      return { success: true, message: 'Profile updated successfully!' };
    }

    return { success: false, message: result.error || 'Update failed' };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const result = await apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, token);

    if (result.success) {
      return { success: true, message: 'Password changed successfully!' };
    }

    return { success: false, message: result.error || 'Password change failed' };
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) return;

    const result = await apiRequest<{ user: User }>('/auth/me', {}, token);
    if (result.success && result.data) {
      setUser(result.data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export token getter for API calls in other parts of the app
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};
