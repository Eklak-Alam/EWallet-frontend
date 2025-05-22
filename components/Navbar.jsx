'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaHome, FaChartLine, FaUserPlus, FaSignInAlt, FaBars, FaTimes, FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', icon: <FaHome className="mr-2" />, path: '/' },
    { name: 'Dashboard', icon: <FaChartLine className="mr-2" />, path: '/dashboard' },
    { name: 'Accounts', icon: <FaWallet className="mr-2" />, path: '/create-account' },
  ];

  const authLinks = [
    { name: 'Login', icon: <FaSignInAlt className="mr-2" />, path: '/login' },
  ];

  const handleLinkClick = (name) => {
    setActiveLink(name);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <FaWallet className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-blue-600">E Wallet</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.path}
                onClick={() => handleLinkClick(link.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                  activeLink === link.name
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.icon}
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Right side (auth/actions) */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
            >
              <FaBell className="h-5 w-5" />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <FaUserCircle className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">User</span>
            </motion.div>

            {authLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                {link.icon}
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {[...navLinks, ...authLinks].map((link) => (
                <motion.a
                  key={link.name}
                  href={link.path}
                  onClick={() => handleLinkClick(link.name)}
                  whileTap={{ scale: 0.95 }}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors mx-2 ${
                    activeLink === link.name
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {link.name}
                  </div>
                </motion.a>
              ))}
              
              {/* User profile in mobile */}
              <div className="px-3 py-3 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FaUserCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">User Account</p>
                  <p className="text-xs text-gray-500">user@ewallet.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;