import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiCreditCard, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const paymentIcons = {
  COD: '💵',
  Card: '💳',
  UPI: '📲',
  'Net Banking': '🏦',
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0] || item.image || 'https://placehold.co/300x300?text=No+Image',
          category: item.category || 'Other',
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shipping,
        totalPrice: total,
      };

      await api.post('/api/orders', orderData);
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in your details to place the order</p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-5xl">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-7 items-start">

            {/* ── LEFT: Shipping + Payment ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiMapPin size={14} className="text-primary-600" />
                  </div>
                  Shipping Address
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      placeholder="123, Main Street"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="Delhi"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="Delhi"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      placeholder="110001"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <span className="flex items-center gap-1"><FiPhone size={11} /> Phone</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiCreditCard size={14} className="text-primary-600" />
                  </div>
                  Payment Method
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {['COD', 'Card', 'UPI', 'Net Banking'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        paymentMethod === method ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === method && <FiCheck size={10} className="text-white" />}
                      </div>
                      <span className="text-lg">{paymentIcons[method]}</span>
                      <span className="font-medium text-sm text-gray-800">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Order Summary</h2>
                <p className="text-xs text-gray-400 mt-0.5">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>

              {/* Items list */}
              <div className="p-6 border-b border-gray-100 space-y-3 max-h-52 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={e => { e.target.src = 'https://placehold.co/100x100?text=?'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-primary-600' : 'text-gray-800'}`}>
                    {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="bg-primary-50 border border-primary-100 rounded-xl px-3 py-2 text-xs text-primary-700">
                    Add <strong>₹{(500 - subtotal).toFixed(0)}</strong> more for <strong>FREE shipping!</strong>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
                </div>

                <p className="text-xs text-gray-400 text-center">GST included in product prices</p>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Placing Order...</>
                    : <>Place Order <FiArrowRight size={15} /></>
                  }
                </motion.button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;