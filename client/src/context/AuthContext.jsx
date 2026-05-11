import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PRODUCTION_URL = 'https://black-and-brown-coffee-shop-production.up.railway.app';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_URL : 'http://localhost:5000');

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  // Restore session from localStorage on page load
  useEffect(() => {
    const restoreSession = async () => {
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');

      if (adminToken) {
        try {
          const res = await axios.get('/api/admin/me', {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          if (res.data.success) setAdmin(res.data.admin);
        } catch {
          localStorage.removeItem('adminToken');
        }
      } else if (userToken) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          if (res.data) setUser(res.data.user || res.data);
        } catch {
          localStorage.removeItem('userToken');
        }
      }
    };
    restoreSession();
  }, []);

  const login = async (emailOrUsername, password, forceAdmin = false) => {
    try {
      if (forceAdmin) {
        const res = await axios.post('/api/admin/login', { emailOrUsername, password });
        if (res.data.success) {
          setAdmin(res.data.admin);
          localStorage.setItem('adminToken', res.data.token);
        }
        return res.data;
      }

      // Try customer login first
      const res = await axios.post('/api/auth/login', { emailOrUsername, password });
      if (res.data.success) {
        // If the user has admin role, route them to admin dashboard
        if (res.data.user?.role === 'admin') {
          const adminRes = await axios.post('/api/admin/login', { emailOrUsername, password });
          if (adminRes.data.success) {
            setAdmin(adminRes.data.admin);
            localStorage.setItem('adminToken', adminRes.data.token);
            return adminRes.data;
          }
        }
        setUser(res.data.user);
        localStorage.setItem('userToken', res.data.token);
      }
      return res.data;
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

  return (
    <AuthContext.Provider value={{ user, admin, isAdmin: !!admin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
