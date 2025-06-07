'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useApi } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: apiLoading, error: apiError, clearError } = useApi();

  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(); // Clear API errors when typing
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 5) newErrors.password = 'Password must be at least 5 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await login({
        username: formData.username,
        password: formData.password
      });
      
      toast.success('Login successful! Redirecting...', {
        autoClose: 1500,
        pauseOnHover: false
      });
      
      // Redirect after success message
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      // Error will be shown from the API context
      if (!error.message.includes('Incorrect username or password')) {
        toast.error(error.message || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || apiLoading;

  return (
    <div className="min-h-screen flex text-gray-900 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {apiError && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.username 
                      ? 'border-red-500 focus:ring-red-300' 
                      : 'border-gray-300 focus:ring-indigo-300'
                  } focus:outline-none focus:ring-2`}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-300' 
                      : 'border-gray-300 focus:ring-indigo-300'
                  } focus:outline-none focus:ring-2`}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Login <FiArrowRight />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/create-account')}
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              disabled={isLoading}
            >
              Create account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}