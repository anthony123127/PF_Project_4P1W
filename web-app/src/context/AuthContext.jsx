import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { authApiUrl } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            if (decoded.exp * 1000 < Date.now()) {
                logout();
                return;
            }

            fetchMe(token);
        } catch (e) {
            logout();
        }
    }, []);

    const fetchMe = async (token) => {
        try {
            const response = await axios.get(`${authApiUrl}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await axios.post(`${authApiUrl}/login`, { username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        await fetchMe(token);
        return response.data;
    };

    const register = async (username, email, password) => {
        const response = await axios.post(`${authApiUrl}/register`, { username, email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        await fetchMe(token);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
    };

    const isAdmin = user?.roles?.includes('admin');

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
