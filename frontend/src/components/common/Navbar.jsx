import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiMenu,
  FiX,
  FiSearch
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNegotiation } from '../../context/NegotiationContext';
import api from "../../utils/api.js"

const Navbar = () => {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const { getCartCount } = useCart();
  const { pendingCount, getSellerNegotiations } = useNegotiation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Seller ke liye har 1 minute mein negotiations fetch karo
  useEffect(() => {
    if (isSeller) {
      getSellerNegotiations(); // login karte hi turant

      const interval = setInterval(() => {
        getSellerNegotiations();
      }, 60000); // har 1 minute

      return () => clearInterval(interval); // cleanup on logout
    }
  }, [isSeller]);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  const isActive = (path) => location.pathname === path;
  const desktopActive = "text-primary-600 font-bold border-b-2 border-primary-600";
  const desktopNormal = "text-gray-700 hover:text-primary-600 font-medium transition-colors";
  const mobileActive = "block text-primary-600 font-bold border-l-4 border-primary-600 pl-2";
  const mobileNormal = "block text-gray-700 hover:text-primary-600 font-medium";

  const cartCount = getCartCount();

  const [pendingProductsCount, setPendingProductsCount] = useState(0);

  useEffect(() => {
  if (isAdmin) {
    fetchPendingProducts();
    const interval = setInterval(fetchPendingProducts, 60000); // har 1 min
    return () => clearInterval(interval);
  }
}, [isAdmin]);

const fetchPendingProducts = async () => {
  try {
    const { data } = await api.get('/api/products/admin/all');
    const pending = data.data.filter(p => !p.isActive).length;
    setPendingProductsCount(pending);
  } catch (error) {
    console.log('Pending products fetch failed');
  }
};

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
            <Link to="/" className={isActive('/') ? desktopActive : desktopNormal}>
              Home
            </Link>
            <Link to="/products" className={isActive('/products') ? desktopActive : desktopNormal}>
              Products
            </Link>

            {/* Desktop Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/products?search=${e.target.value.trim()}`);
                    e.target.value = '';
                  }
                }}
                className="border border-gray-300 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-48"
              />
              <FiSearch className="absolute right-3 top-2 text-gray-400" />
            </div>

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
                          <Link to="/admin/dashboard" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <MdDashboard className="text-primary-600" />
                            <span>Dashboard</span>
                          </Link>
                          <Link to="/admin/orders" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <FiPackage className="text-primary-600" />
                            <span>Manage Orders</span>
                          </Link>
                          <Link to="/admin/products" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                           <FiPackage className="text-primary-600" />
                           <span>Manage Products</span>
                           {pendingProductsCount > 0 && (
                           <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                             {pendingProductsCount}
                           </span>
                          )}
                         </Link>
                          <Link to="/admin/negotiations" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>🤝</span>
                            <span>Negotiations</span>
                          </Link>
                        </>
                      )}

                      {/* Seller Links */}
                      {isSeller && (
                        <>
                          <Link to="/seller/dashboard" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>🏪</span>
                            <span>Seller Dashboard</span>
                          </Link>
                          <Link to="/seller/orders" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <FiPackage className="text-indigo-600" />
                            <span>My Orders</span>
                          </Link>
                          {/* Negotiations with badge */}
                          <Link to="/seller/negotiations" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>🤝</span>
                            <span>Negotiations</span>
                            {pendingCount > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {pendingCount}
                              </span>
                            )}
                          </Link>
                          <Link to="/my-negotiations" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>🛍️</span>
                            <span>My Negotiations</span>
                          </Link>
                          <Link to="/spending-report" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>📊</span>
                            <span>Spending Report</span>
                          </Link>
                        </>
                      )}

                      {/* User Links */}
                      {!isAdmin && !isSeller && (
                        <>
                          <Link to="/orders" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <FiPackage className="text-primary-600" />
                            <span>My Orders</span>
                          </Link>
                          <Link to="/my-negotiations" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>🤝</span>
                            <span>My Negotiations</span>
                          </Link>
                          <Link to="/spending-report" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <span>📊</span>
                            <span>Spending Report</span>
                          </Link>
                        </>
                      )}

                      {/* Common Links */}
                      <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowUserMenu(false)}>
                        <FiSettings className="text-primary-600" />
                        <span>Profile</span>
                      </Link>

                      <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full transition-colors">
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
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/products?search=${e.target.value.trim()}`);
                      closeMobileMenu();
                      e.target.value = '';
                    }
                  }}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              <Link to="/" onClick={closeMobileMenu} className={isActive('/') ? mobileActive : mobileNormal}>
                Home
              </Link>
              <Link to="/products" onClick={closeMobileMenu} className={isActive('/products') ? mobileActive : mobileNormal}>
                Products
              </Link>
              <Link to="/cart" onClick={closeMobileMenu} className={isActive('/cart') ? mobileActive : mobileNormal}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>

              {user ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link to="/admin/dashboard" onClick={closeMobileMenu} className={isActive('/admin/dashboard') ? mobileActive : mobileNormal}>
                        Dashboard
                      </Link>
                      <Link to="/admin/orders" onClick={closeMobileMenu} className={isActive('/admin/orders') ? mobileActive : mobileNormal}>
                        📦 Manage Orders
                      </Link>
                      <div className="flex items-center justify-between">
                      <Link to="/admin/products" onClick={closeMobileMenu} className={isActive('/admin/products') ? mobileActive : mobileNormal}>
                       📦 Manage Products
                      </Link>
                       {pendingProductsCount > 0 && (
                         <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {pendingProductsCount}
                        </span>
                        )}
                       </div>
                      <Link to="/admin/negotiations" onClick={closeMobileMenu} className={isActive('/admin/negotiations') ? mobileActive : mobileNormal}>
                        🤝 Negotiations
                      </Link>
                    </>
                  ) : isSeller ? (
                    <>
                      <Link to="/seller/dashboard" onClick={closeMobileMenu} className={isActive('/seller/dashboard') ? mobileActive : mobileNormal}>
                        🏪 Seller Dashboard
                      </Link>
                      <Link to="/seller/orders" onClick={closeMobileMenu} className={isActive('/seller/orders') ? mobileActive : mobileNormal}>
                        📦 My Orders
                      </Link>
                      {/* Negotiations with badge - mobile */}
                      <div className="flex items-center justify-between">
                        <Link to="/seller/negotiations" onClick={closeMobileMenu} className={isActive('/seller/negotiations') ? mobileActive : mobileNormal}>
                          🤝 Negotiations
                        </Link>
                        {pendingCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingCount}
                          </span>
                        )}
                      </div>
                      <Link to="/my-negotiations" onClick={closeMobileMenu} className={isActive('/my-negotiations') ? mobileActive : mobileNormal}>
                        🛍️ My Negotiations
                      </Link>
                      <Link to="/spending-report" onClick={closeMobileMenu} className={isActive('/spending-report') ? mobileActive : mobileNormal}>
                        📊 Spending Report
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/orders" onClick={closeMobileMenu} className={isActive('/orders') ? mobileActive : mobileNormal}>
                        📦 My Orders
                      </Link>
                      <Link to="/my-negotiations" onClick={closeMobileMenu} className={isActive('/my-negotiations') ? mobileActive : mobileNormal}>
                        🤝 My Negotiations
                      </Link>
                      <Link to="/spending-report" onClick={closeMobileMenu} className={isActive('/spending-report') ? mobileActive : mobileNormal}>
                        📊 Spending Report
                      </Link>
                    </>
                  )}

                  <Link to="/profile" onClick={closeMobileMenu} className={isActive('/profile') ? mobileActive : mobileNormal}>
                    ⚙️ Profile
                  </Link>
                  <button onClick={handleLogout} className="block text-red-600 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu} className={isActive('/login') ? mobileActive : mobileNormal}>
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu} className={isActive('/register') ? mobileActive : mobileNormal}>
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