import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as firebaseAuth from 'firebase/auth';
import { auth } from '../services/firebase';
import { UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebaseAuth.User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = ReactRouterDOM.useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Simple role system based on email
        if (currentUser.email === 'admin@afriblend.co.ke') {
          setUserRole('Store Owner');
        } else if (currentUser.email?.startsWith('dev@')) {
          setUserRole('Developer');
        } else {
          // Fallback role for any other authenticated user.
          // In a real app, this would come from a database.
          setUserRole('Store Owner');
        }
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    await firebaseAuth.signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    firebaseAuth.signOut(auth);
    navigate('/');
  };
  
  const value = {
    isAuthenticated: !!user,
    userRole,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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