import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiUser, FiChevronDown } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusConfig = {
  Pending:    { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  Processing: { color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500'   },
  Shipped:    { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Delivered:  { color: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500'  },
  Cancelled:  { color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500'    },
};

const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders/seller-orders');
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to load orders!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Status updated to ${newStatus}! ✅`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (error) {
      toast.error('Status update failed!');
    } finally {
      setUpdatingId(null);
    }
  };

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
          <Link to="/seller/dashboard" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors mb-3">
            <FiArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Product Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''}` : 'No orders yet'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-5xl">

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiPackage size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm">Orders for your products will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, i) => {
                const status = statusConfig[order.orderStatus] || statusConfig.Pending;
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                          <p className="text-xs font-mono font-semibold text-gray-700 truncate max-w-[140px]">{order._id}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                          <FiUser size={12} />
                          <span className="font-medium text-gray-700">{order.user?.name}</span>
                          <span>·</span>
                          <span>{order.user?.email}</span>
                          <span>·</span>
                          <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="px-6 py-5">
                      {/* Mobile buyer info */}
                      <div className="sm:hidden flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                        <FiUser size={12} />
                        <span>{order.user?.name} · {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-5">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                              <img
                                src={item.image || item.product?.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                                alt={item.name}
                                className="w-full h-full object-contain p-1.5"
                                onError={e => { e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                            </div>
                            <p className="font-bold text-sm text-gray-900 flex-shrink-0">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400">Order Total</p>
                          <p className="text-xl font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</p>
                        </div>

                        {order.orderStatus !== 'Cancelled' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Update Status:</span>
                            <div className="relative">
                              <select
                                value={order.orderStatus}
                                disabled={updatingId === order._id}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white cursor-pointer disabled:opacity-60"
                              >
                                {allowedStatuses.map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <FiChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>
                            {updatingId === order._id && (
                              <span className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                            ❌ Order Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;