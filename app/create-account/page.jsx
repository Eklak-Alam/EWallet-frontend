'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useApi } from '@/context/AppContext';

const countryCodes = [
  { code: '+1', name: 'US' },
  { code: '+44', name: 'UK' },
  { code: '+91', name: 'IN' },
  { code: '+81', name: 'JP' },
  { code: '+86', name: 'CH' },
  { code: '+33', name: 'FR' },
  { code: '+49', name: 'GR' },
];

export default function CreateAccount() {
  const router = useRouter();
  const { register, loading, error, clearError } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^[0-9]{7,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (7-15 digits)';
    }

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: `${formData.countryCode}-${formData.phoneNumber}`,
        password: formData.password,
      };

      await register(userData);

      toast.success('Account created! Redirecting...', { autoClose: 2000 });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || loading;
  const fullPhoneNumber = formData.countryCode + formData.phoneNumber;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen text-gray-950 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-20"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">Create Account</h1>
        <p className="text-gray-600 text-center mb-8">Join our financial platform</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-1/3 px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {countryCodes.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
              <div className="relative w-2/3">
                <FiPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                  placeholder="9876543210"
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>}
            <p className="text-xs text-gray-500 mt-1">Your phone: {fullPhoneNumber}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                placeholder="At least 6 characters"
                disabled={isLoading}
              />
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Create Account <FiArrowRight /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}