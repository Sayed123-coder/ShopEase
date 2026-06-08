import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) { toast.error('Enter Email!'); return; }
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

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmNewPassword) { toast.error('Please fill all the fields!'); return; }
    if (newPassword !== confirmNewPassword) { toast.error('Passwords do not match!'); return; }
    if (newPassword.length < 6) { toast.error('Password should be at least 6 characters!'); return; }
    setForgotLoading(true);
    try {
      await api.post('/api/auth/reset-password', { email: forgotEmail, otp, newPassword });
      toast.success('Password reset successfully! Please login 🎉');
      handleCloseModal();
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
    <div className="min-h-screen flex">

      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center text-white"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
            🛒
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome back!</h2>
          <p className="text-primary-100 text-lg mb-10 leading-relaxed max-w-sm">
            Shop smart, save more. Bargain prices, track spending — all in one place.
          </p>

          {/* Feature pills */}
          <div className="space-y-3">
            {['🤝 Bargain prices with sellers', '📊 Smart spending tracker', '🚀 Fast & secure checkout'].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white/10 rounded-xl px-5 py-3 text-sm font-medium text-left"
              >
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo (mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">S</div>
              <span className="text-2xl font-bold text-gray-900">Shop<span className="text-primary-600">Ease</span></span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
              <p className="text-gray-400 text-sm mt-1">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
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

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-primary-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign in <FiArrowRight size={16} /></span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-grow h-px bg-gray-100"></div>
              <span className="text-gray-400 text-xs font-medium">OR</span>
              <div className="flex-grow h-px bg-gray-100"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white text-gray-700 font-medium py-2.5 rounded-xl transition-all text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-gray-500 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md border border-gray-100"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  {forgotStep === 1 ? '🔑' : '✉️'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {forgotStep === 1 ? 'Forgot Password?' : 'Check your email'}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {forgotStep === 1 ? 'Enter your email to receive a reset OTP' : `OTP sent to ${forgotEmail}`}
                </p>
              </div>

              {forgotStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-field pl-10 w-full"
                    />
                  </div>
                  <button onClick={handleSendOtp} disabled={forgotLoading} className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2">
                    {forgotLoading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Sending...</> : <>Send OTP <FiArrowRight size={15} /></>}
                  </button>
                </div>
              )}

              {forgotStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="input-field w-full text-center text-2xl font-bold tracking-[0.5em]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="input-field pl-10 w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                      <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password" className="input-field pl-10 w-full" />
                    </div>
                  </div>
                  <button onClick={handleResetPassword} disabled={forgotLoading} className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2">
                    {forgotLoading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Resetting...</> : 'Reset Password 🔐'}
                  </button>
                  <button type="button" onClick={() => setForgotStep(1)} className="w-full text-sm text-primary-600 hover:underline text-center">
                    ← Resend OTP
                  </button>
                </div>
              )}

              <button onClick={handleCloseModal} className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2.5 rounded-xl font-medium text-sm transition-colors">
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