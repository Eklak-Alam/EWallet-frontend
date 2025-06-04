'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiActivity, FiCreditCard, FiDollarSign, FiHome, FiLogOut, FiPlus, FiRefreshCw, FiSend, FiUser, FiUsers } from 'react-icons/fi';
import { FaPiggyBank } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankBalance, setBankBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  // Form hooks
  const { register: registerUser, handleSubmit: handleUserSubmit } = useForm();
  const { register: registerBank, handleSubmit: handleBankSubmit } = useForm();
  const { register: registerTransaction, handleSubmit: handleTransactionSubmit } = useForm();

  // Mock data for charts
  const transactionData = [
    { name: 'BANK_TO_WALLET', value: 400 },
    { name: 'WALLET_TO_BANK', value: 300 },
    { name: 'USER_TO_USER', value: 200 },
    { name: 'ADMIN_TO_USER', value: 100 },
  ];

  const userGrowthData = [
    { name: 'Jan', users: 100 },
    { name: 'Feb', users: 200 },
    { name: 'Mar', users: 150 },
    { name: 'Apr', users: 300 },
    { name: 'May', users: 400 },
    { name: 'Jun', users: 500 },
  ];

  // Mock API calls
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock API call
      const mockUsers = [
        { id: 1, phone: '+91-9876543210', balance: 1000, accountNumber: '7b7e2720-9fbb-4191-80b3-9eabb06d1798' },
        { id: 2, phone: '+91-9876543211', balance: 2000, accountNumber: '7b7e2720-9fbb-4191-80b3-9eabb06d1799' },
        { id: 3, phone: '+91-9876543212', balance: 3000, accountNumber: '7b7e2720-9fbb-4191-80b3-9eabb06d1800' },
      ];
      setUsers(mockUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankBalance = async () => {
    setLoading(true);
    try {
      // Mock API call
      setBankBalance(50000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    setLoading(true);
    try {
      // Mock API call
      setWalletBalance(10000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Mock API call
      const mockTransactions = [
        { id: 1, sender: 'Admin', receiver: '+91-9876543210', amount: 100, method: 'BANK_TO_WALLET', date: new Date() },
        { id: 2, sender: '+91-9876543210', receiver: '+91-9876543211', amount: 50, method: 'USER_TO_USER', date: new Date() },
        { id: 3, sender: 'Admin', receiver: '+91-9876543212', amount: 200, method: 'BANK_TO_WALLET', date: new Date() },
      ];
      setTransactions(mockTransactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBankMoney = async (data) => {
    setLoading(true);
    try {
      // Mock API call
      console.log('Adding money:', data);
      alert(`Successfully added ${data.balance} to account ${data.accountNumber}`);
      fetchBankBalance();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initiateTransaction = async (data) => {
    setLoading(true);
    try {
      // Mock API call
      console.log('Initiating transaction:', data);
      alert(`Successfully sent ${data.amount} to ${data.receiver}`);
      fetchTransactions();
      fetchBankBalance();
      fetchWalletBalance();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserByPhone = async (phone) => {
    setLoading(true);
    try {
      // Mock API call
      const user = users.find(u => u.phone === phone);
      if (user) {
        alert(`User found: ${user.phone} - Balance: ${user.balance}`);
      } else {
        alert('User not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'bank':
        fetchBankBalance();
        break;
      case 'wallet':
        fetchWalletBalance();
        break;
      case 'transactions':
        fetchTransactions();
        break;
      default:
        fetchBankBalance();
        fetchWalletBalance();
        fetchTransactions();
        break;
    }
  }, [activeTab]);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pt-20">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-indigo-800 text-white shadow-lg pt-2">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FiActivity className="mr-2" /> Admin Portal
          </h1>
        </div>
        <nav className="mt-6">
          <div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full px-6 py-3 text-left ${activeTab === 'dashboard' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <FiHome className="mr-3" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center w-full px-6 py-3 text-left ${activeTab === 'users' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <FiUser className="mr-3" /> User Management
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex items-center w-full px-6 py-3 text-left ${activeTab === 'bank' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <FaPiggyBank className="mr-3" /> Bank Operations
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center w-full px-6 py-3 text-left ${activeTab === 'wallet' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <FiCreditCard className="mr-3" /> Wallet Management
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center w-full px-6 py-3 text-left ${activeTab === 'transactions' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <FiDollarSign className="mr-3" /> Transactions
            </button>
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={() => router.push('/logout')}
            className="flex items-center w-full px-4 py-2 text-left rounded-md hover:bg-indigo-700"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                <FiRefreshCw className="animate-spin text-4xl text-indigo-600 mb-4" />
                <p className="text-lg">Processing your request...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow p-6 flex items-center"
                  >
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                      <FiUsers size={24} />
                    </div>
                    <div>
                      <h3 className="text-gray-500">Total Users</h3>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow p-6 flex items-center"
                  >
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <FaPiggyBank size={24} />
                    </div>
                    <div>
                      <h3 className="text-gray-500">Bank Balance</h3>
                      <p className="text-2xl font-bold">${bankBalance.toLocaleString()}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow p-6 flex items-center"
                  >
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                      <FiCreditCard size={24} />
                    </div>
                    <div>
                      <h3 className="text-gray-500">Wallet Balance</h3>
                      <p className="text-2xl font-bold">${walletBalance.toLocaleString()}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Transaction Types</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={transactionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {transactionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userGrowthData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="users" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.slice(0, 5).map((txn) => (
                          <tr key={txn.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.sender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.receiver}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${txn.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.method}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {txn.date.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">User Management</h1>
                  <button 
                    onClick={() => document.getElementById('findUserModal').showModal()}
                    className="btn btn-primary flex items-center"
                  >
                    <FiUser className="mr-2" /> Find User
                  </button>
                </div>

                {/* Find User Modal */}
                <dialog id="findUserModal" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Find User by Phone Number</h3>
                    <form onSubmit={handleUserSubmit((data) => getUserByPhone(data.phone))} className="mt-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Phone Number</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. +91-9876543210" 
                          className="input input-bordered w-full"
                          {...registerUser('phone', { required: true })}
                        />
                      </div>
                      <div className="modal-action">
                        <button type="submit" className="btn btn-primary">
                          Find User
                        </button>
                        <button 
                          type="button" 
                          className="btn"
                          onClick={() => document.getElementById('findUserModal').close()}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  </div>
                </dialog>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">All Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.accountNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.balance}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                              <button className="text-red-600 hover:text-red-900">Suspend</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Tab */}
            {activeTab === 'bank' && (
              <div>
                <h1 className="text-3xl font-bold mb-8">Bank Operations</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Bank Balance</h3>
                      <div className="text-2xl font-bold text-green-600">${bankBalance.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => fetchBankBalance()}
                      className="btn btn-outline flex items-center"
                    >
                      <FiRefreshCw className="mr-2" /> Refresh Balance
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-6">Add Money to User Account</h3>
                    <form onSubmit={handleBankSubmit(addBankMoney)}>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Account Number</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter account number" 
                          className="input input-bordered w-full"
                          {...registerBank('accountNumber', { required: true })}
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Amount</span>
                        </label>
                        <input 
                          type="number" 
                          placeholder="Enter amount" 
                          className="input input-bordered w-full"
                          {...registerBank('balance', { required: true, min: 0 })}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary w-full flex items-center">
                        <FiPlus className="mr-2" /> Add Money
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div>
                <h1 className="text-3xl font-bold mb-8">Wallet Management</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Admin Wallet Balance</h3>
                      <div className="text-2xl font-bold text-purple-600">${walletBalance.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => fetchWalletBalance()}
                      className="btn btn-outline flex items-center"
                    >
                      <FiRefreshCw className="mr-2" /> Refresh Balance
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-6">Wallet Actions</h3>
                    <div className="space-y-4">
                      <button className="btn btn-primary w-full flex items-center">
                        <FiPlus className="mr-2" /> Create New Wallet
                      </button>
                      <button className="btn btn-secondary w-full flex items-center">
                        <FiDollarSign className="mr-2" /> Fund User Wallet
                      </button>
                      <button className="btn btn-error w-full flex items-center">
                        <FiUser className="mr-2" /> Suspend Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h1 className="text-3xl font-bold mb-8">Transaction Management</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-6">Initiate Transaction</h3>
                    <form onSubmit={handleTransactionSubmit(initiateTransaction)}>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Receiver Phone</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. +91-9876543210" 
                          className="input input-bordered w-full"
                          {...registerTransaction('receiver', { required: true })}
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Amount</span>
                        </label>
                        <input 
                          type="number" 
                          placeholder="Enter amount" 
                          className="input input-bordered w-full"
                          {...registerTransaction('amount', { required: true, min: 0 })}
                        />
                      </div>
                      <div className="form-control mb-4">
                        <label className="label">
                          <span className="label-text">Transaction Method</span>
                        </label>
                        <select 
                          className="select select-bordered w-full"
                          {...registerTransaction('transactionMethod', { required: true })}
                        >
                          <option value="BANK_TO_WALLET">Bank to Wallet</option>
                          <option value="WALLET_TO_BANK">Wallet to Bank</option>
                          <option value="USER_TO_USER">User to User</option>
                          <option value="ADMIN_TO_USER">Admin to User</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary w-full flex items-center">
                        <FiSend className="mr-2" /> Initiate Transaction
                      </button>
                    </form>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-6">Transaction History</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Amount</th>
                            <th>Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((txn) => (
                            <tr key={txn.id}>
                              <td>{txn.id}</td>
                              <td>{txn.sender}</td>
                              <td>{txn.receiver}</td>
                              <td>${txn.amount}</td>
                              <td>{txn.method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}