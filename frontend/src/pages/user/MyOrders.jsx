import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const OrderTimeline = ({ status }) => {
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 my-3 p-3 bg-red-50 rounded-lg">
        <span className="text-red-500 text-xl">❌</span>
        <span className="text-red-500 font-semibold text-sm">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center gap-1 my-3 w-full">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          {/* Circle + Label */}
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              index < currentIndex
                ? 'bg-green-500 border-green-500 text-white'
                : index === currentIndex
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {index < currentIndex ? '✓' : index + 1}
            </div>
            <p className={`text-xs mt-1 text-center whitespace-nowrap ${
              index <= currentIndex ? 'text-indigo-600 font-semibold' : 'text-gray-400'
            }`}>
              {step}
            </p>
          </div>

          {/* Line between steps */}
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${
              index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
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
      toast.error('Orders load nahi ho paye!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Kya aap sach mein order cancel karna chahte hain?')) {
      try {
        await api.put(`/api/orders/${orderId}/cancel`);
        toast.success('Order Cancelled! ✅');
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Cancel nahi ho paya!');
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-lg">No orders yet!</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Start Shopping
          </button>
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

              {/* Order Timeline */}
              <OrderTimeline status={order.orderStatus} />

              {/* Order Items */}
              <div className="space-y-2 mb-3">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/300x300.png?text=No+Image'}
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

              {/* Order Footer */}
              <div className="flex justify-between items-center border-t pt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.orderStatus)}`}>
                      Order: {order.orderStatus}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  {/* Cancel Button */}
                  {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="border border-red-500 text-red-500 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-red-50 transition-colors w-fit"
                    >
                      Cancel Order ❌
                    </button>
                  )}
                </div>
                <p className="font-bold text-gray-800">Total: ₹{order.totalPrice}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;