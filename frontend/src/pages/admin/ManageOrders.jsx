import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Processing': return 'bg-blue-100 text-blue-800';
    case 'Shipped': return 'bg-purple-100 text-purple-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders');
      setOrders(data.data);
    } catch (error) {
      toast.error('Orders load nahi ho paye!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, orderStatus, paymentStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, {
        orderStatus,
        paymentStatus,
      });
      toast.success('Order updated successfully! ✅');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed!');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders 📋</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-lg">No orders yet!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">

              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="text-sm font-mono font-semibold">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Placed on</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-3 bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium">👤 {order.user?.name}</p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.image || item.product?.image?.[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ₹{item.quantity * item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total + Status */}
              <div className="flex flex-wrap justify-between items-center border-t pt-3 gap-3">
                <p className="font-bold text-gray-800">Total: ₹{order.totalPrice}</p>

                <div className="flex flex-wrap gap-2 items-center">

                  {/* Order Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.orderStatus)}`}>
                    Order: {order.orderStatus}
                  </span>

                  {/* Payment Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Payment: {order.paymentStatus}
                  </span>

                  {order.orderStatus !== 'Cancelled' ? (
                     <>
                  <select
                   value={order.orderStatus}
                   onChange={(e) => handleStatusUpdate(order._id, e.target.value, null)}
                   className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
              </select>

               <select
                value={order.paymentStatus}
                onChange={(e) => handleStatusUpdate(order._id, null, e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
               >
              <option value="Pending">Payment Pending</option>
            <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
           </select>
            </>
            ) : (
            <span className="text-red-500 font-bold text-sm ml-2">Locked</span>
              )}

                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;