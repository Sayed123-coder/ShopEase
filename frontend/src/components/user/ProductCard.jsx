import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const isInCart = cartItems.some(item => item._id === product._id);

  const handleCartAction = (e) => {
    e.preventDefault();
    if (isInCart) {
      navigate('/cart');
      return;
    }
    if (product.stock === 0) {
      toast.error('Product out of stock! ❌');
      return;
    }
    addToCart(product);
    toast.success('Added to cart! 🛒');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Link to={`/products/${product._id}`} className="block h-full">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group">

          {/* Image */}
          <div className="relative overflow-hidden bg-gray-50 h-52 flex-shrink-0">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x300?text=No+Image';
              }}
            />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                {discount}% OFF
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm">
                  Out of Stock
                </span>
              </div>
            )}
            {/* Wishlist hint on hover */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                Only {product.stock} left!
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Brand & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                {product.brand || product.category}
              </span>
              <div className="flex items-center gap-1">
                <FiStar className="fill-amber-400 text-amber-400" size={13} />
                <span className="text-xs text-gray-500 font-medium">{product.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-snug group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4 mt-auto">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCartAction}
              disabled={product.stock === 0 && !isInCart}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200
                ${product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'btn-primary'
                }`}
            >
              {product.stock === 0 ? (
                <span>Out of Stock</span>
              ) : isInCart ? (
                <><FiCheck size={15} /><span>Go to Cart</span></>
              ) : (
                <><FiShoppingCart size={15} /><span>Add to Cart</span></>
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;