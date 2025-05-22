'use client'
import { motion } from 'framer-motion';
import { FaWallet, FaArrowRight, FaCheck, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const LandingPage = () => {

  return (
    <div className="font-sans bg-gray-50">      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Digital Wallet</span> for Modern Life
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
              Send, receive, and manage your money with our secure e-wallet solution. Get started with just $50 today!
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg inline-block mb-10"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaWallet className="text-blue-600 text-3xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Starting Balance</p>
                  <p className="text-3xl font-bold text-blue-600">$1.00</p>
                </div>
              </div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/create-account"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <FaArrowRight />
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition-colors"
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="intro" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EWallet?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing digital payments with our secure, fast, and user-friendly platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Instant Transfers",
                desc: "Send money to anyone in seconds",
                icon: <FaWallet className="text-blue-600 text-3xl" />
              },
              {
                title: "No Hidden Fees",
                desc: "Transparent pricing with no surprises",
                icon: <FaCheck className="text-blue-600 text-3xl" />
              },
              {
                title: "Bank-Level Security",
                desc: "Your money is always protected",
                icon: <FaCheck className="text-blue-600 text-3xl" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl text-center"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About EWallet</h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2023, EWallet has quickly become a leader in digital payment solutions. Our mission is to make financial transactions simple, secure, and accessible to everyone.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With over 1 million users worldwide, we're committed to providing the best digital wallet experience with cutting-edge technology and exceptional customer service.
              </p>
              <motion.a
                href="#create"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Join Now
              </motion.a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                  <FaWallet className="text-6xl" />
                  <span className="ml-4 text-2xl font-bold">EWallet App</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with EWallet in just 3 simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                desc: "Sign up in minutes with just your email and phone number"
              },
              {
                step: "2",
                title: "Add Funds",
                desc: "Start with $50 and add more through bank transfer or card"
              },
              {
                step: "3",
                title: "Start Transacting",
                desc: "Send, receive, and manage your money effortlessly"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl text-center relative"
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We stand out from the competition with these key advantages
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            "24/7 Customer Support",
            "Instant Transfers",
            "Low Transaction Fees",
            "Multi-Currency Support",
            "Advanced Security",
            "User-Friendly Interface",
            "Fast KYC Process",
            "Global Access"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-3 bg-gray-200 text-black p-3 rounded-xl"
              >
                <FaCheck className="mt-1 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions or need assistance? Our team is here to help you with any inquiries about our e-wallet services.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@ewallet.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Address</h3>
                    <p className="text-gray-600">123 Finance Street, Digital City, DC 10001</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 bg-gray-50 p-8 rounded-xl"
            >
              <form className="space-y-6 text-gray-950">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaWallet className="text-blue-400 text-2xl" />
                <span className="text-xl font-bold">EWallet</span>
              </div>
              <p className="text-gray-400">
                The most secure and user-friendly digital wallet for all your financial needs.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#process" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Download App</h3>
              <div className="space-y-3">
                <button className="w-full bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                  <span>App Store</span>
                </button>
                <button className="w-full bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                  <span>Google Play</span>
                </button>
              </div>
            </div>
          </div>
          
          <footer className="bg-gray-800 text-white py-6 text-center">
            <p>&copy; {new Date().getFullYear()} EWallet. All rights reserved.</p>
          </footer>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;