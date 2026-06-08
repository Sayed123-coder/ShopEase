import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setLoading(true);
    try {
      await api.post('/api/auth/send-register-otp', { name: formData.name, email: formData.email, password: formData.password });
      toast.success('OTP sent! Check your email 📧');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) { toast.error('Enter 6 digit OTP!'); return; }
    setOtpLoading(true);
    try {
      const { data } = await api.post('/api/auth/verify-register-otp', { email: formData.email, otp });
      await register(null, null, null, data.data);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP!');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/send-register-otp', { name: formData.name, email: formData.email, password: formData.password });
      toast.success('OTP resent! 📧');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-white/5 rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center text-white"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
            ✨
          </div>
          <h2 className="text-4xl font-bold mb-4">Join ShopEase</h2>
          <p className="text-primary-100 text-lg mb-10 leading-relaxed max-w-sm">
            Create your free account and start shopping smarter today.
          </p>

          <div className="space-y-3 text-left">
            {[
              { icon: '🛒', text: 'Access thousands of products' },
              { icon: '🤝', text: 'Bargain prices with sellers' },
              { icon: '📊', text: 'Track your spending smartly' },
              { icon: '🔒', text: 'Safe & secure shopping' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 text-sm font-medium"
              >
                <span>{f.icon}</span>
                <span>{f.text}</span>
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
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">S</div>
              <span className="text-2xl font-bold text-gray-900">Shop<span className="text-primary-600">Ease</span></span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            {/* Step 1 — Register Form */}
            {step === 1 && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
                  <p className="text-gray-400 text-sm mt-1">Fill in the details to get started</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field pl-10"
                        placeholder="Sayed Aman"
                      />
                    </div>
                  </div>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-field pl-10 pr-10"
                        placeholder="Min. 6 characters"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="input-field pl-10"
                        placeholder="••••••••"
                      />
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <FiCheck className="absolute right-3.5 top-3.5 text-primary-500" size={16} />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Sending OTP...</>
                      : <>Send OTP <FiArrowRight size={16} /></>
                    }
                  </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
                </p>
              </>
            )}

            {/* Step 2 — OTP Verification */}
            {step === 2 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                      📧
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
                    <p className="text-gray-400 text-sm mt-2">
                      OTP sent to <span className="font-semibold text-primary-600">{formData.email}</span>
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter 6-digit OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="• • • • • •"
                        maxLength={6}
                        className="input-field w-full text-center text-3xl font-bold tracking-[0.5em] py-4"
                      />
                      {/* OTP progress dots */}
                      <div className="flex justify-center gap-2 mt-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < otp.length ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otp.length !== 6}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {otpLoading
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Verifying...</>
                        : <><FiCheck size={16} /> Verify & Create Account</>
                      }
                    </button>

                    <div className="flex flex-col items-center gap-2">
                      <button onClick={handleResendOtp} disabled={loading} className="text-sm text-primary-600 hover:underline font-medium disabled:opacity-50">
                        {loading ? 'Resending...' : 'Resend OTP'}
                      </button>
                      <button onClick={() => { setStep(1); setOtp(''); }} className="text-sm text-gray-400 hover:text-gray-600">
                        ← Change email
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;