import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data.data));
    setUser(data.data);
    return data;
  };

 const register = async (name, email, password, userData = null) => {
  
  if (userData) {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return;
  }
  
  const { data } = await api.post('/api/auth/register', { name, email, password });
  localStorage.setItem('userInfo', JSON.stringify(data.data));
  setUser(data.data);
  return data;
};

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    setUser(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
