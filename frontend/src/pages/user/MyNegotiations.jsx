import { useEffect } from 'react';
import { useNegotiation } from '../../context/NegotiationContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiCheck, FiTag } from 'react-icons/fi';

const statusConfig = {
  Pending:   { color: 'bg-yellow-50 text-yellow-700 border-yellow-200',  dot: 'bg-yellow-400' },
  Accepted:  { color: 'bg-green-50 text-green-700 border-green-200',     dot: 'bg-green-500'  },
  Rejected:  { color: 'bg-red-50 text-red-700 border-red-200',           dot: 'bg-red-500'    },
  Countered: { color: 'bg-blue-50 text-blue-700 border-blue-200',        dot: 'bg-blue-500'   },
};

const MyNegotiations = () => {
  const { negotiations, loading, getMyNegotiations, rejectCounter } = useNegotiation();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getMyNegotiations();
  }, []);

  const handleBuyNow = (negotiation) => {
    const price = negotiation.status === 'Countered'
      ? negotiation.counterPrice
      : negotiation.offeredPrice;

    addToCart({ ...negotiation.product, _id: negotiation.product._id, price, name: negotiation.product.name, image: negotiation.product.images?.[0] }, 1);
    toast.success(`Added to cart at ₹${price}! 🎉`);
    navigate('/cart');
  };

  const handleRejectCounter = async (negotiation) => {
    try {
      await rejectCounter(negotiation._id);
      toast.success('Counter offer rejected!');
      getMyNegotiations();
    } catch (error) {
      toast.error('Something went wrong!');
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
          <h1 className="text-2xl font-bold text-gray-900">My Negotiations</h1>
          <p className="text-gray-400 text-sm mt-1">
            {negotiations.length > 0 ? `${negotiations.length} negotiation${negotiations.length > 1 ? 's' : ''}` : 'No negotiations yet'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-3xl">

        {/* Empty State */}
        {negotiations.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
              🤝
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No negotiations yet</h3>
            <p className="text-gray-400 text-sm mb-6">Browse products and make an offer to start bargaining!</p>
            <button onClick={() => navigate('/products')} className="btn-primary flex items-center gap-2 mx-auto">
              <FiTag size={15} /> Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {negotiations.map((n, i) => {
                const status = statusConfig[n.status] || statusConfig.Pending;
                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex gap-4">

                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                        <img
                          src={n.product?.images?.[0]}
                          alt={n.product?.name}
                          className="w-full h-full object-contain p-2"
                          onError={e => { e.target.src = 'https://placehold.co/100x100?text=?'; }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">

                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h2 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">
                              {n.product?.name}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Original: ₹{n.originalPrice?.toLocaleString()}
                            </p>
                          </div>
                          {/* Status badge */}
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {n.status}
                          </span>
                        </div>

                        {/* Price info */}
                        <div className="flex flex-wrap gap-4 mb-3">
                          <div className="bg-gray-50 rounded-xl px-3 py-2">
                            <div className="text-xs text-gray-400">Your Offer</div>
                            <div className="text-sm font-bold text-gray-900">₹{n.offeredPrice?.toLocaleString()}</div>
                          </div>
                          {n.counterPrice && (
                            <div className="bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
                              <div className="text-xs text-blue-500">Counter Offer</div>
                              <div className="text-sm font-bold text-blue-700">₹{n.counterPrice?.toLocaleString()}</div>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        {n.message && (
                          <p className="text-xs text-gray-400 mb-3 italic">"{n.message}"</p>
                        )}

                        {/* Actions */}
                        {n.status === 'Rejected' && (
                          <p className="text-xs text-red-500 flex items-center gap-1.5">
                            <FiX size={13} /> Offer rejected — make a new offer on the product page!
                          </p>
                        )}

                        {n.status === 'Accepted' && (
                          <button
                            onClick={() => handleBuyNow(n)}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                          >
                            <FiShoppingCart size={14} /> Buy at ₹{n.offeredPrice?.toLocaleString()}
                          </button>
                        )}

                        {n.status === 'Countered' && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleBuyNow(n)}
                              className="flex items-center gap-2 btn-primary text-sm py-2 px-4"
                            >
                              <FiCheck size={14} /> Accept & Buy at ₹{n.counterPrice?.toLocaleString()}
                            </button>
                            <button
                              onClick={() => handleRejectCounter(n)}
                              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border border-red-200"
                            >
                              <FiX size={14} /> Reject Counter
                            </button>
                          </div>
                        )}

                        {n.status === 'Pending' && (
                          <p className="text-xs text-yellow-600 flex items-center gap-1.5">
                            ⏳ Waiting for seller's response...
                          </p>
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

export default MyNegotiations;