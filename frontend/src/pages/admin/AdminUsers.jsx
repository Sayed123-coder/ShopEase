import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiTrash2, FiCheck, FiX, FiShield } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const roleConfig = {
  admin:  { color: 'bg-red-50 text-red-700 border-red-200',     label: '👑 Admin'  },
  seller: { color: 'bg-blue-50 text-blue-700 border-blue-200',   label: '🏪 Seller' },
  user:   { color: 'bg-green-50 text-green-700 border-green-200', label: '🛒 User'  },
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Failed to load users!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete account of "${name}"?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success('User deleted!');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveSeller = async (id, name) => {
    if (!window.confirm(`Remove seller access of "${name}"?`)) return;
    setUpdatingId(id);
    try {
      await api.put(`/api/admin/users/${id}/role`, { role: 'user' });
      toast.success('Seller access removed!');
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'user' } : u));
    } catch (error) {
      toast.error('Failed to remove seller!');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApproveSeller = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/approve-seller`);
      toast.success('Seller approved! ✅');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve!');
    }
  };

  const handleRejectSeller = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/reject-seller`);
      toast.success('Request rejected!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to reject!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const pendingRequests = users.filter(u => u.sellerRequest?.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors mb-3">
            <FiArrowLeft size={15} /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-400 text-sm mt-1">Total {users.length} users registered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 max-w-6xl">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-7">
          {[
            { label: 'Total Users',   value: users.filter(u => u.role === 'user').length,   color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-100',  icon: '🛒' },
            { label: 'Total Sellers', value: users.filter(u => u.role === 'seller').length, color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-100',   icon: '🏪' },
            { label: 'Total Admins',  value: users.filter(u => u.role === 'admin').length,  color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-100',    icon: '👑' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending Seller Requests */}
        <AnimatePresence>
          {pendingRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-6 mb-6"
            >
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center text-sm">⏳</span>
                Pending Seller Requests
                <span className="ml-1 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
              </h2>
              <div className="space-y-3">
                {pendingRequests.map((u) => (
                  <div key={u._id} className="flex justify-between items-center bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Requested: {new Date(u.sellerRequest.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {u.sellerRequest?.rejectionCount > 0 && (
                            <span className="ml-2 text-red-400">· Rejected {u.sellerRequest.rejectionCount} time(s) before</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveSeller(u._id)}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <FiCheck size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectSeller(u._id)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <FiX size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiUsers size={16} className="text-primary-600" />
            <h2 className="font-bold text-gray-900">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => {
                  const role = roleConfig[user.role] || roleConfig.user;
                  return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* User */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 text-sm text-gray-500">{user.email}</td>

                      {/* Role */}
                      <td className="py-4 px-5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${role.color}`}>
                          {role.label}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-5 text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        {user.role === 'admin' ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <FiShield size={13} /> Protected
                          </div>
                        ) : (
                          <div className="flex gap-2 flex-wrap">
                            {user.role === 'seller' && (
                              <button
                                onClick={() => handleRemoveSeller(user._id, user.name)}
                                disabled={updatingId === user._id}
                                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                              >
                                {updatingId === user._id
                                  ? <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                                  : <FiX size={12} />
                                }
                                Remove Seller
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              disabled={deletingId === user._id}
                              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {deletingId === user._id
                                ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                                : <FiTrash2 size={12} />
                              }
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminUsers;