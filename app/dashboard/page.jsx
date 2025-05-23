'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiHome, FiCreditCard, FiDollarSign, FiUser, FiLogOut } from 'react-icons/fi';
import UserProfile from '@/components/UserProfile';
import WalletDetails from '@/components/WalletDetails';
import BankDetails from '@/components/BankDetails';
import { useApi } from '@/context/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  const { getUserById, getBankByUserId, getWalletByUserId, loading: apiLoading, error: apiError } = useApi();

  // Track logged in status
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('userId'));

  const [user, setUser] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loggedIn) {
      // If not logged in, redirect immediately to login page
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast.error('No user session found. Please login.');
          setLoggedIn(false); // Update login state
          router.push('/login');
          return;
        }

        const userData = await getUserById(userId);
        setUser(userData);

        const [bankData, walletData] = await Promise.all([
          getBankByUserId(userId),
          getWalletByUserId(userId),
        ]);
        setBankAccount(bankData);
        setWallet(walletData);
      } catch (err) {
        console.error('Dashboard Load Error:', err);
        toast.error(apiError || 'Failed to load dashboard data');
        setLoggedIn(false); // Important: user session invalid
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [loggedIn, router, getUserById, getBankByUserId, getWalletByUserId, apiError]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setLoggedIn(false); // Immediately update state to trigger redirect and stop loading
    router.push('/login');
  };


  // Optional: quick redirect if no userId in localStorage (for safety)
  if (!loggedIn) {
    // Could return null or loading spinner to avoid flickering dashboard
    return null;
  }
  if (loading) {
    return (
      <div className="w-screen h-screen bg-white flex items-center justify-center fixed top-0 left-0 z-50">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"
            ></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">Finance Dashboard</h1>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white shadow-lg lg:min-h-screen">
          <div className="p-6 hidden lg:block">
            <h1 className="text-xl font-bold text-indigo-700">Finance Dashboard</h1>
          </div>
          <nav className="mt-6">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
              { key: 'bank', label: 'Bank Account', icon: <FiCreditCard /> },
              { key: 'wallet', label: 'Wallet', icon: <FiDollarSign /> },
              { key: 'profile', label: 'Profile', icon: <FiUser /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left px-6 py-3 flex items-center ${
                  activeTab === key
                    ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{icon}</span>
                <span>{label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-3 flex items-center text-gray-600 hover:bg-gray-100"
            >
              <FiLogOut className="mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Welcome Back</h2>
                  <UserProfile user={user} />
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-indigo-50 text-indigo-700 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-indigo-100 transition">
                      <span className="text-2xl mb-2">💸</span>
                      <span>Send Money</span>
                    </button>
                    <button className="bg-indigo-50 text-indigo-700 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-indigo-100 transition">
                      <span className="text-2xl mb-2">🔄</span>
                      <span>Exchange</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WalletDetails wallet={wallet} />
                <BankDetails bankAccount={bankAccount} />
              </div>
            </div>
          )}

          {activeTab === 'bank' && <BankDetails bankAccount={bankAccount} expandedView />}
          {activeTab === 'wallet' && <WalletDetails wallet={wallet} expandedView />}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h1>
              <UserProfile user={user} expandedView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}