// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:5000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  const login = async (emailOrUsername, password, isAdmin = false) => {
    try {
      if (isAdmin) {
        const res = await axios.post('/api/admin/login', { username: emailOrUsername, password });
        if (res.data.success) {
          setAdmin(res.data.admin);
          localStorage.setItem('adminToken', res.data.token);
        }
        return res.data;
      } else {
        const res = await axios.post('/api/auth/login', { emailOrUsername, password });
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('userToken', res.data.token);
        }
        return res.data;
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('userToken', res.data.token);
      }
      return res.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
  };

  const isAdmin = !!admin;

  return (
    <AuthContext.Provider value={{ user, admin, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ This is the custom hook
export const useAuth = () => useContext(AuthContext);
