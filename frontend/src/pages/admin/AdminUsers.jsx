import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const roleColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700';
    case 'seller': return 'bg-blue-100 text-blue-700';
    default: return 'bg-green-100 text-green-700';
  }
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
      toast.error('Fail to load users!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Do you want to delete tha account of?"${name}" `)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success('User deleted! 🗑️');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveSeller = async (id, name) => {
    if (!window.confirm(`Do you want to remove seller acees of?"${name}"`)) return;
    setUpdatingId(id);
    try {
      await api.put(`/api/admin/users/${id}/role`, { role: 'user' });
      toast.success('Seller access removed! ✅');
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

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const pendingRequests = users.filter(u => u.sellerRequest?.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">👥 Manage Users</h1>
            <p className="text-gray-500 mt-1">Total: {users.length} users</p>
          </div>
          <Link to="/admin/dashboard">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'user').length}</p>
            <p className="text-sm text-gray-500">Users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'seller').length}</p>
            <p className="text-sm text-gray-500">Sellers</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-sm text-gray-500">Admins</p>
          </div>
        </div>

        {/* Pending Seller Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-yellow-700">
              ⏳ Pending Seller Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map(u => (
                <div key={u._id} className="flex justify-between items-center border rounded-lg p-3 bg-yellow-50">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400">
                      Requested: {new Date(u.sellerRequest.requestedAt).toLocaleDateString('en-IN')}
                    </p>
                    {u.sellerRequest?.rejectionCount > 0 && (
                      <p className="text-xs text-red-400">
                        Previously rejected: {u.sellerRequest.rejectionCount} time(s)
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveSeller(u._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-semibold"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleRejectSeller(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-semibold"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">

                    {/* User Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>

                    {/* Role Badge */}
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${roleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      {user.role === 'admin' ? (
                        <span className="text-xs text-gray-400">Protected</span>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {/* Seller remove button */}
                          {user.role === 'seller' && (
                            <button
                              onClick={() => handleRemoveSeller(user._id, user.name)}
                              disabled={updatingId === user._id}
                              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50"
                            >
                              {updatingId === user._id ? 'Removing...' : '🔄 Remove Seller'}
                            </button>
                          )}
                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={deletingId === user._id}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50"
                          >
                            {deletingId === user._id ? 'Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminUsers;