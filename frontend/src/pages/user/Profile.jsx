import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCheck, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { updateUser, user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'India' },
    password: '',
    confirmPassword: '',
  });

  const avatarUrl = `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=0284c7&color=fff&size=128`;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/auth/profile');
      const user = data.data;
      const formatted = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India',
        },
        password: '',
        confirmPassword: '',
      };
      setFormData(formatted);
      setOriginalData(formatted);
    } catch (error) {
      toast.error('Failed to load profile!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'zipCode', 'country'].includes(name)) {
      setFormData((prev) => {
        const updated = { ...prev, address: { ...prev.address, [name]: value } };
        setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalData));
        return updated;
      });
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        setIsChanged(JSON.stringify(updated) !== JSON.stringify(originalData));
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      };
      if (formData.password) payload.password = formData.password;
      const { data } = await api.put('/api/auth/profile', payload);
      updateUser(data.data);
      toast.success('Profile updated successfully! ✅');
      setIsChanged(false);
      setOriginalData({ ...formData, password: '', confirmPassword: '' });
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setSaving(false);
    }
  };

  const handleBecomeSeller = async () => {
    try {
      await api.put('/api/seller/become-seller');
      updateUser({ ...authUser, sellerRequest: { status: 'pending' } });
      toast.success('Request submitted! Admin will review it. ⏳');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const tabs = [
    { id: 'basic',    label: 'Basic Info',  icon: <FiUser size={14} />    },
    { id: 'address',  label: 'Address',     icon: <FiMapPin size={14} />  },
    { id: 'security', label: 'Security',    icon: <FiLock size={14} />    },
  ];

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white text-sm transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account information</p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-4xl">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-20 h-20 rounded-2xl border-2 border-primary-100 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiCheck size={12} className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{formData.name || 'User'}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{formData.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-100">
                  {authUser?.role === 'admin' ? '👑 Admin' : authUser?.role === 'seller' ? '🏪 Seller' : '🛒 Shopper'}
                </span>

                {/* Become Seller section */}
                {authUser?.role === 'user' && (
                  <>
                    {authUser?.sellerRequest?.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">
                        ⏳ Seller Request Pending...
                      </span>
                    ) : authUser?.sellerRequest?.rejectionCount >= 3 ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                        🚫 Blocked (3/3 attempts used)
                      </span>
                    ) : authUser?.sellerRequest?.status === 'rejected' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-500">
                          ❌ Rejected ({authUser?.sellerRequest?.rejectionCount}/3 attempts)
                        </span>
                        <button
                          onClick={handleBecomeSeller}
                          className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                        >
                          🏪 Apply Again
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleBecomeSeller}
                        className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                      >
                        🏪 Become a Seller
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >

          {/* Basic Info */}
          {activeTab === 'basic' && (
            <div>
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FiUser size={14} className="text-primary-600" />
                </div>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          {activeTab === 'address' && (
            <div>
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FiMapPin size={14} className="text-primary-600" />
                </div>
                Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input type="text" name="street" value={formData.address.street} onChange={handleChange} placeholder="123, Main Street" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" name="city" value={formData.address.city} onChange={handleChange} placeholder="Delhi" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" name="state" value={formData.address.state} onChange={handleChange} placeholder="Delhi" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ZIP Code</label>
                  <input type="text" name="zipCode" value={formData.address.zipCode} onChange={handleChange} placeholder="110001" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" name="country" value={formData.address.country} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div>
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FiLock size={14} className="text-primary-600" />
                </div>
                Change Password
              </h2>
              <div className="max-w-md space-y-5">
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" className={`${inputClass} pl-9`} />
                  </div>
                  {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><FiCheck size={12} /> Passwords match</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {(isChanged || formData.password) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end border-t border-gray-100 pt-5"
            >
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary flex items-center gap-2 px-8 disabled:opacity-60"
              >
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Saving...</>
                  : <><FiSave size={15} /> Save Changes</>
                }
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default Profile;