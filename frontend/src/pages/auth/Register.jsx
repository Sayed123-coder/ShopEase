import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Step 1 — Validate form aur OTP bhejo
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/send-register-otp', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('OTP sent! Check your email 📧');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — OTP verify karke account banao
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('6 digit OTP daalo!');
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await api.post('/api/auth/verify-register-otp', {
        email: formData.email,
        otp,
      });

      // AuthContext mein user set karo
      await register(null, null, null, data.data); // token aur user data pass karo
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP!');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/send-register-otp', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('OTP resent! Check your email 📧');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Step 1 — Registration Form */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-2">Join us today!</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

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
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                  {loading ? 'Sending OTP...' : 'Send OTP 📧'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                    Login
                  </Link>
                </p>
              </div>
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
                  <div className="text-5xl mb-3">📧</div>
                  <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    OTP sent to <span className="font-semibold text-primary-600">{formData.email}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-center">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="input-field w-full text-center text-3xl font-bold tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpLoading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {otpLoading ? 'Verifying...' : 'Verify & Create Account ✅'}
                  </button>

                  <div className="text-center space-y-2">
                    <button
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-sm text-primary-600 hover:underline block w-full"
                    >
                      {loading ? 'Resending...' : 'OTP nahi aaya? Dobara bhejo'}
                    </button>
                    <button
                      onClick={() => { setStep(1); setOtp(''); }}
                      className="text-sm text-gray-500 hover:underline block w-full"
                    >
                      ← Email badalna hai? Wapas jao
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default Register;