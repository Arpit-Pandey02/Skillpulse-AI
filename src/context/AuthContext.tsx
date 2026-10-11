import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import type { StudentProfile } from '../types/student';

interface AuthContextType {
  user: StudentProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    university?: string;
    major?: string;
    academicYear?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(apiClient.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Verify active session on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = apiClient.getToken();

      if (storedToken) {
        const res = await apiClient.get('/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid
          apiClient.clearToken();
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // First-time or guest visitor starts clean without pre-filling sample user
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await apiClient.post('/auth/login', { email, password });
    setIsLoading(false);

    if (res.success && res.token) {
      apiClient.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      closeAuthModal();
      return { success: true };
    }

    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    university?: string;
    major?: string;
    academicYear?: string;
  }) => {
    setIsLoading(true);
    const res = await apiClient.post('/auth/register', data);
    setIsLoading(false);

    if (res.success && res.token) {
      apiClient.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      closeAuthModal();
      return { success: true };
    }

    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    apiClient.clearToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
