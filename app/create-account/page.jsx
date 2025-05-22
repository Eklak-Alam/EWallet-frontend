'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useApi } from '@/context/AppContext';

// Enhanced country codes with flags and better formatting
const countryCodes = [
  { code: '+1', name: 'US'},
  { code: '+44', name: 'UK'},
  { code: '+91', name: 'IN'},
  { code: '+81', name: 'JP'},
  { code: '+86', name: 'CH'},
  { code: '+33', name: 'FR'},
  { code: '+49', name: 'GR'},
  // Add more countries as needed
];

export default function CreateAccount() {
  const router = useRouter();
  const { createUser, loading: apiLoading, error: apiError } = useApi();
  
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In your CreateAccount component's handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const userData = {
        name: formData.name,
        userName: formData.userName,
        email: formData.email,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      };
      
      // Use the createUser function from our API context
      const createdUser = await createUser(userData);
      
      // Store user ID in localStorage
      localStorage.setItem('userId', createdUser.id);
      
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine country code and phone number for display
  const fullPhoneNumber = formData.countryCode + formData.phoneNumber;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-gray-950 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-20"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">Create Account</h1>
        <p className="text-gray-600 text-center mb-8">Join our financial platform</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.userName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="johndoe123"
              />
            </div>
            {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative flex-[2]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="1234567890"
                />
              </div>
            </div>
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Your phone number: {fullPhoneNumber}
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                className={`pl-10 w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          </div> */}

          <button
            type="submit"
            disabled={isSubmitting || apiLoading}
            className={`w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${(isSubmitting || apiLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {(isSubmitting || apiLoading) ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/login')}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1"
          >
            Already have an account? Sign in <FiArrowRight />
          </button>
        </div>
      </div>
    </motion.div>
  );
}