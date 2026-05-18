import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Processing': return 'bg-blue-100 text-blue-800';
    case 'Shipped': return 'bg-indigo-100 text-indigo-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Seller sirf yeh statuses set kar sakta hai
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Status updated to ${newStatus}! ✅`);
      // Local state update — refetch nahi karna
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
      );
    } catch (error) {
      toast.error('Status update failed!');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/seller/dashboard" className="text-indigo-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">📦 My Product Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">📭</p>
          <p>Abhi tak koi order nahi aaya!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border rounded-lg p-4 shadow-sm">

              {/* Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm font-semibold">{order._id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="mb-3 text-sm text-gray-600">
                <span>👤 {order.user?.name}</span>
                <span className="mx-2">•</span>
                <span>{order.user?.email}</span>
                <span className="mx-2">•</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 border rounded p-2">
                    <img
                      src={item.image || item.product?.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-bold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total + Status Update */}
              <div className="mt-4 flex justify-between items-center flex-wrap gap-3">
                <div className="text-sm">
                  <span className="text-gray-500">Order Total: </span>
                  <span className="font-bold text-lg">₹{order.totalPrice.toLocaleString()}</span>
                </div>

                {/* Status Update — sirf cancelled nahi hai to dikhao */}
                {order.orderStatus !== 'Cancelled' ? (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 font-medium">Update Status:</label>
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    >
                      {allowedStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {updatingId === order._id && (
                      <span className="text-xs text-indigo-500">Updating...</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-red-500 font-semibold">❌ Order Cancelled</span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;