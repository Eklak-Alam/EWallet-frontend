'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiPhone, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useApi } from '@/context/AppContext';

export default function AdminLogin() {
  const router = useRouter();
  const { loginUser, user, isAdmin, loading: authLoading } = useApi();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isAdmin && !authLoading) {
      router.replace('/admin/dashboard');
    } else if (user && !isAdmin && !authLoading) {
      toast.error('Access denied. Admins only.');
    }
  }, [user, isAdmin, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Phone number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser(formData);

      if (response?.token) {
        if (response.user?.roles?.includes('ROLE_ADMIN')) {
          toast.success('Admin login successful!');
          router.push('/admin/dashboard');
        } else {
          toast.error('Access denied. Not an admin.');
        }
      } else {
        toast.error('Login failed. Invalid credentials.');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">Admin Login</h1>
        <p className="text-gray-600 text-center mb-6">Enter your admin credentials</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-700" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="+91-9876543210"
                autoComplete="username"
                className={`pl-10 w-full px-4 py-2 text-gray-900 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-700" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`pl-10 w-full px-4 text-gray-900 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-200 flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
