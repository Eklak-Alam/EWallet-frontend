'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  FiRefreshCw, FiLogOut, FiArrowUp, FiArrowDown, 
  FiSend, FiUser, FiCreditCard, FiDollarSign, FiList
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useApi } from '@/context/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  const {
    token,
    getUserByPhone,
    getWalletBalance,
    getBankBalance,
    logout,
    clearError,
    isAuthenticated
  } = useApi();

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [transactionType, setTransactionType] = useState(null);
  const [formData, setFormData] = useState({
    receiver: '',
    amount: '',
    transactionMethod: ''
  });

  const phoneNumber = typeof window !== 'undefined' ? localStorage.getItem('phone') : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const fetchDashboardData = async (showToast = false) => {
    if (!isAuthenticated || !phoneNumber) return;
    try {
      setLoading(true);
      clearError();

      const userData = await getUserByPhone(phoneNumber);
      setUser(userData);

      const [walletRes, bankRes] = await Promise.allSettled([
        getWalletBalance(),
        getBankBalance(),
      ]);

      if (walletRes.status === 'fulfilled') setWallet(walletRes.value);
      if (bankRes.status === 'fulfilled') setBankAccount(bankRes.value);

      setDataLoaded(true);
      if (showToast) toast.success('Dashboard refreshed');
    } catch (error) {
      toast.error("Dashboard loading failed");
      if (error?.message?.includes("401")) {
        logout();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    toast.success('Transaction form submitted (mock)');
    setTransactionType(null);
    setFormData({
      receiver: '',
      amount: '',
      transactionMethod: transactionType
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated) return null;

  if (loading && !dataLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white text-gray-900">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-12 w-12 text-indigo-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </motion.svg>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Generate avatar based on phone number
  const generateAvatar = (phone) => {
    const seed = phone || 'default';
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white p-4 hidden md:block">
        <div className="flex items-center space-x-4 p-4 border-b border-indigo-700">
          <img 
            src={generateAvatar(user?.username)} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{user?.fullName || 'User'}</p>
            <p className="text-xs text-indigo-200">{user?.username || ''}</p>
          </div>
        </div>
        
        <nav className="mt-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 ${activeTab === 'profile' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiUser className="mr-3" />
            <span>Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 ${activeTab === 'wallet' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiDollarSign className="mr-3" />
            <span>Wallet</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bank')}
            className={`flex items-center w-full p-3 rounded-lg mb-2 ${activeTab === 'bank' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiCreditCard className="mr-3" />
            <span>Bank Account</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'transactions' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiList className="mr-3" />
            <span>Transactions</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-indigo-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-700 text-red-300 hover:text-red-200"
          >
            <FiLogOut className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-indigo-700">
              {activeTab === 'profile' && 'Profile'}
              {activeTab === 'wallet' && 'Wallet'}
              {activeTab === 'bank' && 'Bank Account'}
              {activeTab === 'transactions' && 'Transactions'}
            </h1>
            <button onClick={handleRefresh} className="text-indigo-600">
              <FiRefreshCw />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-around bg-white shadow-md rounded-lg p-2 mb-6">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-md ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : ''}`}
            >
              <FiUser className="mx-auto" />
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`p-2 rounded-md ${activeTab === 'wallet' ? 'bg-indigo-100 text-indigo-700' : ''}`}
            >
              <FiDollarSign className="mx-auto" />
            </button>
            <button 
              onClick={() => setActiveTab('bank')}
              className={`p-2 rounded-md ${activeTab === 'bank' ? 'bg-indigo-100 text-indigo-700' : ''}`}
            >
              <FiCreditCard className="mx-auto" />
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`p-2 rounded-md ${activeTab === 'transactions' ? 'bg-indigo-100 text-indigo-700' : ''}`}
            >
              <FiList className="mx-auto" />
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center mb-6">
                <img 
                  src={generateAvatar(user?.username)} 
                  alt="User Avatar" 
                  className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user?.fullName || 'User'}</h2>
                  <p className="text-gray-600">{user?.username || 'No phone number'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h3>
                  <p className="text-2xl text-green-600 font-bold">
                    ₹{typeof wallet === 'number' ? wallet.toFixed(2) : '0.00'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Bank Balance</h3>
                  <p className="text-2xl text-blue-600 font-bold">
                    ₹{typeof bankAccount === 'number' ? bankAccount.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Wallet</h2>
                <button 
                  onClick={() => setTransactionType('BANK_TO_WALLET')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <FiArrowDown className="mr-2" /> Add Funds
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Current Balance</p>
                    <p className="text-4xl font-bold mt-2">
                      ₹{typeof wallet === 'number' ? wallet.toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <FiDollarSign className="text-3xl opacity-70" />
                </div>
                
                <div className="mt-6 pt-4 border-t border-white border-opacity-20">
                  <p className="text-sm opacity-80">Linked to: {user?.username || 'Your account'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === 'bank' && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bank Account</h2>
                <button 
                  onClick={() => setTransactionType('WALLET_TO_BANK')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <FiArrowUp className="mr-2" /> Transfer to Bank
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Account Balance</p>
                    <p className="text-4xl font-bold mt-2">
                      ₹{typeof bankAccount === 'number' ? bankAccount.toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <FiCreditCard className="text-3xl opacity-70" />
                </div>
                
                <div className="mt-6 pt-4 border-t border-white border-opacity-20">
                  <p className="text-sm opacity-80">Linked to: {user?.fullName || 'Your account'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button 
                  onClick={() => setTransactionType('BANK_TO_WALLET')}
                  className="bg-indigo-100 text-indigo-700 p-4 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <div className="flex items-center">
                    <FiArrowDown className="text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold">Bank to Wallet</h3>
                      <p className="text-sm text-gray-600">Transfer from bank to wallet</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setTransactionType('BANK_TO_PERSON')}
                  className="bg-indigo-100 text-indigo-700 p-4 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <div className="flex items-center">
                    <FiSend className="text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold">Bank to Person</h3>
                      <p className="text-sm text-gray-600">Send money from bank</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setTransactionType('WALLET_TO_PERSON')}
                  className="bg-indigo-100 text-indigo-700 p-4 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <div className="flex items-center">
                    <FiSend className="text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold">Wallet to Person</h3>
                      <p className="text-sm text-gray-600">Send money from wallet</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-center">No transactions yet</p>
              </div>
            </div>
          )}

          {/* Transaction Form Modal */}
          {transactionType && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {transactionType === 'BANK_TO_WALLET' && 'Bank to Wallet'}
                    {transactionType === 'BANK_TO_PERSON' && 'Bank to Person'}
                    {transactionType === 'WALLET_TO_PERSON' && 'Wallet to Person'}
                    {transactionType === 'WALLET_TO_BANK' && 'Wallet to Bank'}
                  </h3>
                  <button 
                    onClick={() => setTransactionType(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleTransactionSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Receiver Phone Number
                    </label>
                    <input
                      type="text"
                      name="receiver"
                      value={formData.receiver}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+1-9876543213"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="10.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <input
                    type="hidden"
                    name="transactionMethod"
                    value={transactionType}
                  />
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setTransactionType(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}