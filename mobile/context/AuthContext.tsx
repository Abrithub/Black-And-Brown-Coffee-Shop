import React, { createContext, useContext, useState, ReactNode } from 'react';
import api, { setTokens } from '../utils/api';

interface User { id: string; name: string; email: string; role: string; }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { emailOrUsername, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        setTokens(res.token, null);
      }
      return res;
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        setTokens(res.token, null);
      }
      return res;
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setTokens(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
