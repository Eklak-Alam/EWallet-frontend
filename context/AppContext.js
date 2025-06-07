'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ApiContext = createContext();

const SERVICE_URLS = {
  user: 'http://localhost:8082/user',
  wallet: 'http://localhost:8083/wallet',
  bank: 'http://localhost:8085/bank',
  transaction: 'http://localhost:8081/transaction',
};

export const ApiProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
    setAuthLoading(false);
  }, []);

  const handleLogin = useCallback((jwtToken, username) => {
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('phone', username); // Save phone
  }, []);
  
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('phone');
  }, []);
  

  // Generic fetch wrapper
  const safeFetch = async (url, options = {}, requiresAuth = true) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (requiresAuth) {
        const localToken = token || localStorage.getItem('token');
        if (!localToken) throw new Error('Authentication required. Please login.');
        headers['Authorization'] = `Bearer ${localToken}`;
      }

      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Something went wrong');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return null; // If no JSON response
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Specific method wrappers
  const getApi = async (service, endpoint, requiresAuth = true) => {
    const url = `${SERVICE_URLS[service]}${endpoint}`;
    return safeFetch(url, { method: 'GET' }, requiresAuth);
  };

  const postApi = async (service, endpoint, body, requiresAuth = true) => {
    const url = `${SERVICE_URLS[service]}${endpoint}`;
    return safeFetch(url, { method: 'POST', body: JSON.stringify(body) }, requiresAuth);
  };

  const putApi = async (service, endpoint, body, requiresAuth = true) => {
    const url = `${SERVICE_URLS[service]}${endpoint}`;
    return safeFetch(url, { method: 'PUT', body: JSON.stringify(body) }, requiresAuth);
  };

  // 🔐 Auth and Functional API Methods
  const api = {
    login: async (credentials) => {
      const response = await postApi('user', '/login', credentials, false);
      if (response?.token) {
        handleLogin(response.token, credentials.username); // Pass username to store
        return response;
      }
      throw new Error('Login failed: token not received');
    },    
    logout,

    register: async (userData) => {
      // ✅ Works even if response is empty or not JSON
      return postApi('user', '/signup', userData, false);
    },

    getUserByPhone: (phoneNumber) => getApi('user', `/get/${phoneNumber}`),
    getWalletBalance: () => getApi('wallet', '/view/balance'),
    getBankBalance: () => getApi('bank', '/get/balance'),
    addMoneyToBank: (amount) => putApi('bank', '/add/money', { amount }),
    initiateTransaction: (data) => postApi('transaction', '/initiate', data),
  };

  return (
    <ApiContext.Provider
      value={{
        ...api,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        authLoading,
        clearError: () => setError(null),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
