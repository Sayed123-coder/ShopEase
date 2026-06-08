import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiX, FiShoppingBag } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusConfig = {
  Pending:    { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  Processing: { color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500'   },
  Shipped:    { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Delivered:  { color: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500'  },
  Cancelled:  { color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500'    },
};

const OrderTimeline = ({ status }) => {
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 my-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
        <FiX size={15} className="text-red-500" />
        <span className="text-red-600 font-semibold text-sm">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center my-4 w-full">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              index < currentIndex
                ? 'bg-primary-500 border-primary-500 text-white'
                : index === currentIndex
                ? 'bg-primary-600 border-primary-600 text-white ring-4 ring-primary-100'
                : 'bg-white border-gray-200 text-gray-400'
            }`}>
              {index < currentIndex ? '✓' : index + 1}
            </div>
            <p className={`text-xs mt-1.5 text-center whitespace-nowrap font-medium ${
              index <= currentIndex ? 'text-primary-600' : 'text-gray-400'
            }`}>
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full ${
              index < currentIndex ? 'bg-primary-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders/myorders');
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to load orders!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.put(`/api/orders/${orderId}/cancel`);
        toast.success('Order cancelled!');
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not cancel order!');
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} placed` : 'No orders yet'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-4xl">

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiPackage size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet!</h3>
            <p className="text-gray-400 text-sm mb-6">Start shopping and your orders will appear here.</p>
            <button onClick={() => navigate('/products')} className="btn-primary flex items-center gap-2 mx-auto">
              <FiShoppingBag size={15} /> Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {orders.map((order, i) => {
                const status = statusConfig[order.orderStatus] || statusConfig.Pending;
                const paymentPaid = order.paymentStatus === 'Paid';
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-4">
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

                    <div className="px-6 pb-5">
                      {/* Timeline */}
                      <OrderTimeline status={order.orderStatus} />

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={item.image || item.product?.images?.[0]}
                                alt={item.name}
                                className="w-full h-full object-contain p-1.5"
                                onError={e => { e.target.src = 'https://placehold.co/100x100?text=?'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              ₹{(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                            >
                              <FiX size={13} /> Cancel Order
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="text-lg font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</p>
                        </div>
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

export default MyOrders;