import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiShoppingCart, FiZap, FiStar, FiCheck, FiTag } from "react-icons/fi";
import api from "../../utils/api";
import { useNegotiation } from "../../context/NegotiationContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { makeOffer, loading: negotiationLoading, getProductNegotiation } = useNegotiation();
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [negotiationStatus, setNegotiationStatus] = useState(null);
  const [offerCount, setOfferCount] = useState(0);

  const isInCart = cartItems.some(item => item._id === product?._id);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationStatus = async () => {
    if (!isAuthenticated) return;
    const negotiations = await getProductNegotiation(id);
    setOfferCount(negotiations.length);
    if (negotiations.length > 0) {
      const latest = negotiations[negotiations.length - 1];
      setNegotiationStatus(latest.status);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchNegotiationStatus();
  }, [id]);

  const handleMakeOffer = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }
    if (!offeredPrice) {
      toast.error('Please enter your offer price!');
      return;
    }
    try {
      await makeOffer(id, Number(offeredPrice), message);
      toast.success('Offer sent successfully! 🎉');
      setShowModal(false);
      setOfferedPrice('');
      setMessage('');
      fetchNegotiationStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error('Product out of stock!'); return; }
    addToCart({ _id: product._id, name: product.name, price: product.price, images: product.images, category: product.category, stock: product.stock }, 1);
    toast.success('Added to cart! 🛒');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const renderOfferButton = () => {
    if (offerCount >= 3) {
      return (
        <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed text-sm border border-gray-200">
          Offer Limit Reached ❌
        </button>
      );
    }
    const configs = {
      Pending:   { label: 'Offer Sent ⏳',        cls: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100', action: () => navigate('/my-negotiations') },
      Accepted:  { label: 'Offer Accepted ✅',     cls: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',   action: () => navigate('/my-negotiations') },
      Countered: { label: 'Counter Received 🔔',   cls: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',      action: () => navigate('/my-negotiations') },
      Rejected:  { label: 'Make an Offer 🤝',      cls: 'bg-primary-600 text-white hover:bg-primary-700',                  action: () => setShowModal(true) },
      default:   { label: 'Make an Offer 🤝',      cls: 'bg-primary-600 text-white hover:bg-primary-700',                  action: () => setShowModal(true) },
    };
    const cfg = configs[negotiationStatus] || configs.default;
    return (
      <button onClick={cfg.action} className={`w-full py-3 font-semibold rounded-xl text-sm border transition-all ${cfg.cls}`}>
        {cfg.label}
      </button>
    );
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary mt-4">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors">
            <FiArrowLeft size={16} /> Back to Products
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            {/* LEFT — Image */}
            <div className="p-8 border-r border-gray-100 flex flex-col">
              <div className="relative bg-gray-50 rounded-2xl flex items-center justify-center h-80 mb-6 overflow-hidden">
                <img
                  src={product.images?.[0] || product.images}
                  alt={product.name}
                  className="h-full w-full object-contain p-6"
                  onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                />
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {discount}% OFF
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                    <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-3">
                {isInCart ? (
                  <button onClick={() => navigate('/cart')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-sm">
                    <FiCheck size={15} /> Go to Cart
                  </button>
                ) : (
                  <button onClick={handleAddToCart} disabled={product.stock === 0} className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-xl text-sm transition-colors ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'}`}>
                    <FiShoppingCart size={15} /> Add to Cart
                  </button>
                )}
                <button onClick={handleBuyNow} disabled={product.stock === 0} className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-xl text-sm transition-colors ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}>
                  <FiZap size={15} /> Buy Now
                </button>
              </div>

              {/* Offer Button */}
              {renderOfferButton()}
            </div>

            {/* RIGHT — Details */}
            <div className="p-8">

              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-xs text-gray-400 font-medium">{product.brand}</span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1 bg-green-500 text-white text-sm px-2.5 py-1 rounded-lg font-semibold">
                  <FiStar size={13} className="fill-white" /> {product.rating || 'N/A'}
                </div>
                <span className="text-gray-400 text-sm">Ratings & Reviews</span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                  {product.originalPrice > 0 && (
                    <span className="text-gray-400 text-lg line-through">₹{product.originalPrice?.toLocaleString()}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-green-600 font-semibold text-sm">{discount}% off</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">Inclusive of all taxes</p>
              </div>

              {/* Stock status */}
              <div className="mb-5">
                {product.stock === 0 ? (
                  <span className="text-red-500 font-semibold text-sm bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">❌ Out of Stock</span>
                ) : product.stock <= 5 ? (
                  <span className="text-orange-600 font-semibold text-sm bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">⚠️ Only {product.stock} left!</span>
                ) : (
                  <span className="text-green-600 font-semibold text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">✅ In Stock</span>
                )}
              </div>

              {/* Offers */}
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                  <FiTag size={14} className="text-primary-600" /> Available Offers
                </h3>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li className="flex items-center gap-2"><FiCheck size={13} className="text-primary-500 flex-shrink-0" /> 10% instant discount on Axis Bank Cards</li>
                  <li className="flex items-center gap-2"><FiCheck size={13} className="text-primary-500 flex-shrink-0" /> No Cost EMI available</li>
                  <li className="flex items-center gap-2"><FiCheck size={13} className="text-primary-500 flex-shrink-0" /> Special Price for limited time</li>
                </ul>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Description</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md border border-gray-100"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
                <h2 className="text-xl font-bold text-gray-900">Make an Offer</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Original price: <span className="font-semibold text-gray-700">₹{product.price?.toLocaleString()}</span>
                </p>
                <p className="text-xs text-primary-600 font-medium mt-0.5">
                  Offers remaining: {3 - offerCount}/3
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Offer Price (₹)</label>
                  <input
                    type="number"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    placeholder={`Less than ₹${product.price?.toLocaleString()}`}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please give me some discount... 😄"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleMakeOffer}
                    disabled={negotiationLoading}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {negotiationLoading
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Sending...</>
                      : '🚀 Send Offer'
                    }
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;