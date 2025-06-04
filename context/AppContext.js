'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ApiContext = createContext();

const SERVICE_URLS = {
  user: 'http://localhost:8082/user',
  wallet: 'http://localhost:8083/wallet',
  bank: 'http://localhost:8085/bank',
  transaction: 'http://localhost:8081/transaction',
};

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
});


  // Save user & token to localStorage and state
  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchApi = async (base, endpoint, method = 'GET', body = null, auth = false) => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        'Content-Type': 'application/json',
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`${SERVICE_URLS[base]}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Error: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text(); // fallback for plain text
      }

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const api = {
    // USER SERVICE
    registerUser: (data) => fetchApi('user', '/signup', 'POST', data),
    loginUser: async (credentials) => {
      const data = await fetchApi('user', '/login', 'POST', credentials);
      handleLogin(data.user, data.token); // assumes response has `user` and `token`
      return data;
    },
    getUserByPhone: (phoneNumber) => fetchApi('user', `/get/${phoneNumber}`, 'GET', null, true),

    // WALLET SERVICE
    getWalletBalance: () => fetchApi('wallet', '/view/balance', 'GET', null, true),

    // BANK SERVICE
    addBankMoney: (data) => fetchApi('bank', '/add/money', 'PUT', data, true),
    getBankBalance: () => fetchApi('bank', '/get/balance', 'GET', null, true),

    // TRANSACTION SERVICE
    initiateTransaction: (data) => fetchApi('transaction', '/initiate', 'POST', data, true),
    getAllTransactions: () => fetchApi('transaction', '/get/all', 'GET', null, true),
  };

  return (
    <ApiContext.Provider value={{ ...api, user, isAdmin, loading, error, logout }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
