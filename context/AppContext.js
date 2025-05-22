'use client';

import { createContext, useContext, useState } from 'react';

const ApiContext = createContext();

const API_BASE_URL = 'http://localhost:8080/api/v1';

export function ApiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function for API calls
  const fetchApi = async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // User endpoints
  const getUsers = async () => {
    return fetchApi('/users');
  };

  const getUserById = async (id) => {
    return fetchApi(`/users/${id}`);
  };

  const createUser = async (userData) => {
    return fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  };

  const updateUser = async (id, userData) => {
    return fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  };

  const deleteUser = async (id) => {
    return fetchApi(`/users/${id}`, {
      method: 'DELETE'
    });
  };

  const getUserByEmail = async (email) => {
    return fetchApi(`/users/email/${email}`);
  };

  const getUserByUsername = async (username) => {
    return fetchApi(`/users/username/${username}`);
  };

  const getUserByPhone = async (phone) => {
    return fetchApi(`/users/phone/${phone}`);
  };

  // Bank endpoints
  const getBankByUserId = async (userId) => {
    return fetchApi(`/banks/user/${userId}`);
  };

  const deleteBankByUserId = async (userId) => {
    return fetchApi(`/banks/user/${userId}`, {
      method: 'DELETE'
    });
  };

  // Wallet endpoints
  const getWalletByUserId = async (userId) => {
    return fetchApi(`/wallets/user/${userId}`);
  };

  const deleteWalletByUserId = async (userId) => {
    return fetchApi(`/wallets/user/${userId}`, {
      method: 'DELETE'
    });
  };


  return (
    <ApiContext.Provider value={{
      loading,
      error,
      // User methods
      getUsers,
      getUserById,
      createUser,
      updateUser,
      deleteUser,
      getUserByEmail,
      getUserByUsername,
      getUserByPhone,
      // Bank methods
      getBankByUserId,
      deleteBankByUserId,
      // Wallet methods
      getWalletByUserId,
      deleteWalletByUserId
    }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}