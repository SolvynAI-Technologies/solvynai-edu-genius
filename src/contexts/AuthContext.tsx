
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, schoolName: string, gender: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@solvynai.edu',
    fullName: 'Demo User',
    schoolName: 'SolvynAI Academy',
    gender: 'other',
    focusTime: 240,
  },
  {
    id: '2',
    email: 'alex@school.edu',
    fullName: 'Alex Johnson',
    schoolName: 'Springfield High',
    gender: 'male',
    focusTime: 320,
  },
  {
    id: '3',
    email: 'maria@college.edu',
    fullName: 'Maria Garcia',
    schoolName: 'Westside College',
    gender: 'female',
    focusTime: 180,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('solvyn_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to authenticate
    setIsLoading(true);
    try {
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      setCurrentUser(user);
      localStorage.setItem('solvyn_user', JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    fullName: string, 
    schoolName: string, 
    gender: string
  ) => {
    setIsLoading(true);
    try {
      // In a real app, this would create a new user in the database
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        fullName,
        schoolName,
        gender: gender as 'male' | 'female' | 'other',
        focusTime: 0,
      };
      setCurrentUser(newUser);
      localStorage.setItem('solvyn_user', JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('solvyn_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const updatedUser = {...currentUser, ...data};
    setCurrentUser(updatedUser);
    localStorage.setItem('solvyn_user', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
