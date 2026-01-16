
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { MOCK_USER, MOCK_ADMIN } from '../mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Persistence logic (simulated)
  useEffect(() => {
    const saved = localStorage.getItem('tatlight_auth');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = useCallback(async (email: string) => {
    // Simulate API call to FastAPI
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const selectedUser = email.includes('admin') ? MOCK_ADMIN : MOCK_USER;
        setUser(selectedUser);
        localStorage.setItem('tatlight_auth', JSON.stringify(selectedUser));
        resolve();
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('tatlight_auth');
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
