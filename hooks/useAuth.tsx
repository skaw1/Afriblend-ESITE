
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (user: string, pass: string) => Promise<void>;
  developerLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('afriblend-auth') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return localStorage.getItem('afriblend-role') as UserRole | null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('afriblend-auth', String(isAuthenticated));
    if (isAuthenticated && userRole) {
      localStorage.setItem('afriblend-role', userRole);
    } else {
      localStorage.removeItem('afriblend-role');
    }
  }, [isAuthenticated, userRole]);

  const login = (user: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Mock authentication
      if (user.startsWith('dev@') && pass === 'password') {
        setIsAuthenticated(true);
        setUserRole('Developer');
        resolve();
      } else if (user.toLowerCase() === 'admin@afriblend.co.ke' && pass === 'password') {
        setIsAuthenticated(true);
        setUserRole('Store Owner');
        resolve();
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  };

  const developerLogin = () => {
    setIsAuthenticated(true);
    setUserRole('Developer');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, developerLogin, logout }}>
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