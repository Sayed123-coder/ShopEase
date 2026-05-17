import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Forgot Password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  // Step 1 — OTP bhejo
  const handleSendOtp = async () => {
    if (!forgotEmail) {
      toast.error('Email daalo!');
      return;
    }
    setForgotLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email: forgotEmail });
      toast.success('OTP sent! Check your email 📧');
      setForgotStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email not found!');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2 — Reset Password
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmNewPassword) {
      toast.error('Sab fields fill karo!');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords match nahi kar rahe!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password kam se kam 6 characters ka hona chahiye!');
      return;
    }
    setForgotLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        email: forgotEmail,
        otp,
        newPassword,
      });
      toast.success('Password reset ho gaya! Ab login karo 🎉');
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="text-gray-600 mt-2">Login to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-primary-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 bg-white text-gray-700 font-semibold py-2.5 rounded-xl transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {forgotStep === 1 ? '🔑 Forgot Password' : '✅ Verify OTP'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {forgotStep === 1
                    ? 'Enter your email — we will send you an OTP'
                    : `OTP sent to ${forgotEmail}`}
                </p>
              </div>

              {/* Step 1 — Email */}
              {forgotStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <FiMail className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-field pl-10 w-full"
                    />
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={forgotLoading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending OTP...' : 'Send OTP 📧'}
                  </button>
                </div>
              )}

              {/* Step 2 — OTP + New Password */}
              {forgotStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6 digit OTP"
                      maxLength={6}
                      className="input-field w-full text-center text-2xl font-bold tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-4 text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="input-field pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-4 text-gray-400" />
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="input-field pl-10 w-full"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    disabled={forgotLoading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password 🔐'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-full text-sm text-primary-600 hover:underline"
                  >
                    OTP nahi aaya? Dobara bhejo
                  </button>
                </div>
              )}

              <button
                onClick={handleCloseModal}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;