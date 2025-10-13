import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored authentication
        const storedUser = localStorage.getItem('coffeeShopUser');
        const storedAdmin = localStorage.getItem('coffeeShopAdmin');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (storedAdmin) {
            setIsAdmin(JSON.parse(storedAdmin));
        }

        setLoading(false);
    }, []);

    const login = (email, password, isAdminLogin = false) => {
        if (isAdminLogin) {
            if (email === 'admin' && password === 'admin') {
                setIsAdmin(true);
                localStorage.setItem('coffeeShopAdmin', 'true');
                return { success: true, message: 'Admin login successful' };
            } else {
                return { success: false, message: 'Invalid admin credentials' };
            }
        } else {
            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('coffeeShopUsers') || '[]');
            const existingUser = existingUsers.find(user => user.email === email);

            if (existingUser) {
                // User exists, just sign them in
                setUser(existingUser);
                localStorage.setItem('coffeeShopUser', JSON.stringify(existingUser));
                return { success: true, message: 'Welcome back!', isExistingUser: true };
            } else {
                // New user, need to register first
                return { success: false, message: 'Please sign up first', needsRegistration: true };
            }
        }
    };

    const register = (name, email, password) => {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('coffeeShopUsers') || '[]');
        const existingUser = existingUsers.find(user => user.email === email);

        if (existingUser) {
            return { success: false, message: 'User already exists. Please sign in instead.' };
        }

        const userData = {
            id: Date.now(),
            name,
            email,
            joinDate: new Date().toISOString()
        };

        // Add to users list
        existingUsers.push(userData);
        localStorage.setItem('coffeeShopUsers', JSON.stringify(existingUsers));

        // Set as current user
        setUser(userData);
        localStorage.setItem('coffeeShopUser', JSON.stringify(userData));
        return { success: true, message: 'Registration successful' };
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('coffeeShopUser');
        localStorage.removeItem('coffeeShopAdmin');
    };

    const value = {
        user,
        isAdmin,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
