import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiLogOut, 
  FiPackage, 
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = getCartCount();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gradient"
            >
              🛒 ShopEase
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Products
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{user.name}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                    >
                      {/* Admin Links */}
                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <MdDashboard className="text-primary-600" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FiPackage className="text-primary-600" />
                            <span>Manage Orders</span>
                          </Link>
                          <Link
                            to="/admin/negotiations"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>🤝</span>
                            <span>Negotiations</span>
                          </Link>
                        </>
                      )}

                      {/* Seller Links */}
                      {isSeller && (
                        <>
                          <Link
                            to="/seller/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>🏪</span>
                            <span>Seller Dashboard</span>
                          </Link>
                          <Link
                            to="/seller/negotiations"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>🤝</span>
                            <span>Negotiations</span>
                          </Link>
                          <Link
                            to="/my-negotiations"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>🛍️</span>
                            <span>My Negotiations</span>
                          </Link>
                          <Link
                            to="/spending-report"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>📊</span>
                            <span>Spending Report</span>
                          </Link>
                        </>
                      )}

                      {/* User Links - sirf normal user ke liye */}
                      {!isAdmin && !isSeller && (
                        <>
                          <Link
                            to="/orders"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FiPackage className="text-primary-600" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/my-negotiations"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>🤝</span>
                            <span>My Negotiations</span>
                          </Link>
                          <Link
                            to="/spending-report"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>📊</span>
                            <span>Spending Report</span>
                          </Link>
                        </>
                      )}

                      {/* Common Links */}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiSettings className="text-primary-600" />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full transition-colors"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <button className="btn-secondary px-4 py-2">Login</button>
                </Link>
                <Link to="/register">
                  <button className="btn-primary px-4 py-2">Sign Up</button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700"
          >
            {showMobileMenu ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-200 py-4 space-y-4"
            >
              <Link to="/" className="block text-gray-700 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link to="/products" className="block text-gray-700 hover:text-primary-600 font-medium">
                Products
              </Link>
              <Link to="/cart" className="block text-gray-700 hover:text-primary-600 font-medium">
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>

              {user ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link to="/admin/dashboard" className="block text-gray-700 hover:text-primary-600 font-medium">
                        Dashboard
                      </Link>
                      <Link to="/admin/orders" className="block text-gray-700 hover:text-primary-600 font-medium">
                        📦 Manage Orders
                      </Link>
                      <Link to="/admin/negotiations" className="block text-gray-700 hover:text-primary-600 font-medium">
                        🤝 Negotiations
                      </Link>
                    </>
                  ) : isSeller ? (
                    <>
                      <Link to="/seller/dashboard" className="block text-gray-700 hover:text-primary-600 font-medium">
                        🏪 Seller Dashboard
                      </Link>
                      <Link to="/seller/negotiations" className="block text-gray-700 hover:text-primary-600 font-medium">
                        🤝 Negotiations
                      </Link>
                      <Link to="/my-negotiations" className="block text-gray-700 hover:text-primary-600 font-medium">
                        🛍️ My Negotiations
                      </Link>
                      <Link to="/spending-report" className="block text-gray-700 hover:text-primary-600 font-medium">
                        📊 Spending Report
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/orders" className="block text-gray-700 hover:text-primary-600 font-medium">
                        📦 My Orders
                      </Link>
                      <Link to="/my-negotiations" className="block text-gray-700 hover:text-primary-600 font-medium">
                        🤝 My Negotiations
                      </Link>
                      <Link to="/spending-report" className="block text-gray-700 hover:text-primary-600 font-medium">
                        📊 Spending Report
                      </Link>
                    </>
                  )}

                  <Link to="/profile" className="block text-gray-700 hover:text-primary-600 font-medium">
                    ⚙️ Profile
                  </Link>
                  <button onClick={handleLogout} className="block text-red-600 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-700 hover:text-primary-600 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="block text-gray-700 hover:text-primary-600 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;