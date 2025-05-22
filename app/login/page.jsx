'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useApi } from '@/context/AppContext';

export default function Login() {
  const router = useRouter();
  const { loginUser, loading: apiLoading, error: apiError } = useApi();

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const user = await loginUser(formData);
      localStorage.setItem('userId', user.id);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
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
        <p className="text-gray-600 text-center mb-8">Login with username and phone</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                placeholder="1234567890"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || apiLoading}
            className={`w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition ${(isSubmitting || apiLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {(isSubmitting || apiLoading) ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/create-account')}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1"
          >
            Don't have an account? Register <FiLogIn />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
