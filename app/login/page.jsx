'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiUser, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useApi } from '@/context/AppContext';

export default function Login() {
  const router = useRouter();
  const { loginUser, loading: apiLoading } = useApi();
  const [checkingAuth, setCheckingAuth] = useState(true); // Track auth check status

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if token exists
useEffect(() => {
    const token = localStorage.getItem('userId');
    if (token) {
      router.replace('/dashboard'); // use replace to avoid back button confusion
    } else {
      setCheckingAuth(false); // no token, show login form
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser(formData); // response should have token & user
      const { token, user } = response;

      if (token && user?.id) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Login with your credentials</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                placeholder="johndoe"
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLogIn className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || apiLoading}
            className={`w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition ${(isSubmitting || apiLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting || apiLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/create-account')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </motion.div>
  );
}
