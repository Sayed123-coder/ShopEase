import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  // Check karo product cart mein hai ya nahi
  const isInCart = cartItems.some(item => item._id === product._id);

  const handleCartAction = (e) => {
    e.preventDefault(); // Link navigate rok
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/products/${product._id}`} className="block h-full">
        <div className="card group overflow-hidden flex flex-col h-full">

          {/* Image */}
          <div className="relative overflow-hidden bg-white h-56 flex-shrink-0">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x300?text=No+Image';
              }}
            />
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {discount}% OFF
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Brand & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-600 uppercase">
                {product.brand || product.category}
              </span>
              <div className="flex items-center space-x-1 text-yellow-500">
                <FiStar className="fill-current" size={14} />
                <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-4 mt-auto">
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Cart Button - 3 states */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCartAction}
              disabled={product.stock === 0 && !isInCart}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200
                ${product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'          // Out of Stock
                  : isInCart
                  ? 'bg-green-500 hover:bg-green-600 text-white'            // Go to Cart
                  : 'btn-primary'                                            // Add to Cart
                }`}
            >
              {product.stock === 0 ? (
                <>
                  <span>Out of Stock ❌</span>
                </>
              ) : isInCart ? (
                <>
                  <FiCheck />
                  <span>Go to Cart</span>
                </>
              ) : (
                <>
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>

          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;