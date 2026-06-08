import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiUser, FiChevronDown, FiLock } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusConfig = {
  Pending:    { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  Processing: { color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500'   },
  Shipped:    { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Delivered:  { color: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500'  },
  Cancelled:  { color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500'    },
};

const selectClass = "appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white cursor-pointer";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders');
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to load orders!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, orderStatus, paymentStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { orderStatus, paymentStatus });
      toast.success('Order updated! ✅');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed!');
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length > 0 ? `${orders.length} total orders` : 'No orders yet'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-6xl">

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiPackage size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm">All orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, i) => {
                const status = statusConfig[order.orderStatus] || statusConfig.Pending;
                const paymentPaid = order.paymentStatus === 'Paid';
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                      <div className="flex items-center gap-5">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                          <p className="text-xs font-mono font-semibold text-gray-700 truncate max-w-[140px]">{order._id}</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-xs text-gray-400 mb-0.5">Placed on</p>
                          <p className="text-xs font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                          Order: {order.orderStatus}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${paymentPaid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="px-6 py-5">
                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-xl px-4 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {order.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{order.user?.name}</p>
                          <p className="text-xs text-gray-400">{order.user?.email}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-5">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                              <img
                                src={item.image || item.product?.images?.[0]}
                                alt={item.name}
                                className="w-full h-full object-contain p-1.5"
                                onError={e => { e.target.src = 'https://placehold.co/100x100?text=?'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                              ₹{(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex flex-wrap justify-between items-center border-t border-gray-100 pt-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Order Total</p>
                          <p className="text-xl font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</p>
                        </div>

                        {order.orderStatus !== 'Cancelled' ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Order Status dropdown */}
                            <div className="relative">
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value, null)}
                                className={selectClass}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <FiChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>

                            {/* Payment Status dropdown */}
                            <div className="relative">
                              <select
                                value={order.paymentStatus}
                                onChange={(e) => handleStatusUpdate(order._id, null, e.target.value)}
                                className={selectClass}
                              >
                                <option value="Pending">Payment Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Failed">Failed</option>
                              </select>
                              <FiChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-semibold">
                            <FiLock size={12} /> Order Locked (Cancelled)
                          </div>
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

export default ManageOrders;