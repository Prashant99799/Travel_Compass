import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: () => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users storage (in real app, this would be API calls)
const STORAGE_KEY = 'compass_users';
const AUTH_KEY = 'compass_auth';
const PENDING_VERIFICATION_KEY = 'compass_pending_verification';

const getStoredUsers = (): Record<string, { user: User; password: string; verificationToken?: string }> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveUsers = (users: Record<string, { user: User; password: string; verificationToken?: string }>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth) {
      const { email } = JSON.parse(storedAuth);
      const users = getStoredUsers();
      if (users[email]) {
        setUser(users[email].user);
      }
    }
    setIsLoading(false);
  }, []);

  const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getStoredUsers();
    const userRecord = users[email.toLowerCase()];
    
    if (!userRecord) {
      setIsLoading(false);
      return { success: false, message: 'No account found with this email' };
    }
    
    if (userRecord.password !== password) {
      setIsLoading(false);
      return { success: false, message: 'Incorrect password' };
    }
    
    if (!userRecord.user.isVerified) {
      localStorage.setItem(PENDING_VERIFICATION_KEY, email.toLowerCase());
      setIsLoading(false);
      return { success: false, message: 'Please verify your email first. Check your inbox.' };
    }
    
    setUser(userRecord.user);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: email.toLowerCase() }));
    setIsLoading(false);
    return { success: true, message: 'Login successful!' };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getStoredUsers();
    
    if (users[email.toLowerCase()]) {
      setIsLoading(false);
      return { success: false, message: 'An account with this email already exists' };
    }
    
    const verificationToken = generateToken();
    const newUser: User = {
      id: generateToken(),
      email: email.toLowerCase(),
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    users[email.toLowerCase()] = {
      user: newUser,
      password,
      verificationToken
    };
    
    saveUsers(users);
    localStorage.setItem(PENDING_VERIFICATION_KEY, email.toLowerCase());
    
    // In a real app, you would send an email here
    console.log(`Verification token for ${email}: ${verificationToken}`);
    
    setIsLoading(false);
    return { 
      success: true, 
      message: 'Account created! Please check your email to verify your account.',
      // For demo purposes, we'll include the token
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    const pendingEmail = localStorage.getItem(PENDING_VERIFICATION_KEY);
    
    if (!pendingEmail) {
      setIsLoading(false);
      return { success: false, message: 'No pending verification found' };
    }
    
    const userRecord = users[pendingEmail];
    
    if (!userRecord) {
      setIsLoading(false);
      return { success: false, message: 'User not found' };
    }
    
    if (userRecord.verificationToken !== token) {
      setIsLoading(false);
      return { success: false, message: 'Invalid verification code' };
    }
    
    // Mark as verified
    userRecord.user.isVerified = true;
    delete userRecord.verificationToken;
    saveUsers(users);
    
    // Auto login after verification
    setUser(userRecord.user);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: pendingEmail }));
    localStorage.removeItem(PENDING_VERIFICATION_KEY);
    
    setIsLoading(false);
    return { success: true, message: 'Email verified successfully!' };
  };

  const resendVerification = async (): Promise<{ success: boolean; message: string }> => {
    const pendingEmail = localStorage.getItem(PENDING_VERIFICATION_KEY);
    
    if (!pendingEmail) {
      return { success: false, message: 'No pending verification found' };
    }
    
    const users = getStoredUsers();
    const userRecord = users[pendingEmail];
    
    if (!userRecord) {
      return { success: false, message: 'User not found' };
    }
    
    const newToken = generateToken();
    userRecord.verificationToken = newToken;
    saveUsers(users);
    
    console.log(`New verification token for ${pendingEmail}: ${newToken}`);
    
    return { success: true, message: 'Verification email resent! Check your inbox.' };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    
    if (!users[email.toLowerCase()]) {
      // Don't reveal if email exists
      return { success: true, message: 'If an account exists with this email, you will receive password reset instructions.' };
    }
    
    // In real app, send password reset email
    console.log(`Password reset requested for ${email}`);
    
    return { success: true, message: 'If an account exists with this email, you will receive password reset instructions.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword
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

// Helper to get verification token for demo
export const getVerificationToken = (email: string): string | null => {
  const users = getStoredUsers();
  return users[email.toLowerCase()]?.verificationToken || null;
};
