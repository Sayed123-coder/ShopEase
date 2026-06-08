import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
    toast.success('Quantity updated');
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.success('Removed from cart');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  /* ── EMPTY STATE ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={36} className="text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-8">Add some products to get started!</p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <FiShoppingCart size={15} /> Browse Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart
            <span className="ml-3 text-base font-normal text-gray-400">
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Review your items before checkout</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-7 items-start">

          {/* ── CART ITEMS ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-5"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                      onError={e => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <Link to={`/products/${item._id}`}>
                        <h3 className="font-semibold text-gray-800 mt-0.5 text-sm leading-snug hover:text-primary-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">
                        ₹{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <FiMinus size={13} />
                        </button>
                        <span className="w-9 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <FiPlus size={13} />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                        >
                          <FiTrash2 size={13} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link to="/products" className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1 mt-1">
              ← Continue Shopping
            </Link>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Line items */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-800">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-primary-600' : 'text-gray-800'}`}>
                    {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Free shipping nudge */}
              {shipping > 0 && (
                <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-xs text-primary-700 leading-relaxed">
                  Add <strong>₹{(500 - subtotal).toFixed(0)}</strong> more for <strong>FREE shipping!</strong>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
              </div>

              {/* CTAs */}
              <Link to="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-2"
                >
                  Proceed to Checkout <FiArrowRight size={15} />
                </motion.button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;