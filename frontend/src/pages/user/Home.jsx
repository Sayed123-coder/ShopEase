import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight, FiTag } from 'react-icons/fi';
import api from '../../utils/api';
import ProductCard from '../../components/user/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get('/api/products/featured');
      setFeaturedProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <FiTruck className="w-5 h-5" />, title: 'Free Shipping', description: 'On orders above ₹500' },
    { icon: <FiShield className="w-5 h-5" />, title: 'Secure Payment', description: '100% protected' },
    { icon: <FiRefreshCw className="w-5 h-5" />, title: 'Easy Returns', description: '7 days policy' },
    { icon: <FiHeadphones className="w-5 h-5" />, title: '24/7 Support', description: 'Always here for you' },
  ];

  const categories = [
    { name: 'Electronics', emoji: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', bg: 'from-blue-400 to-blue-600' },
    { name: 'Fashion', emoji: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', bg: 'from-pink-400 to-rose-500' },
    { name: 'Books', emoji: '📚', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', bg: 'from-amber-400 to-orange-500' },
    { name: 'Sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', bg: 'from-emerald-400 to-teal-500' },
  ];

  // Floating collage product images
  const collageItems = [
    { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', label: 'Watch', price: '₹8,999', rotate: '-6deg', zIndex: 1, top: '8px', left: '0px' },
    { img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200', label: 'Perfume', price: '₹2,499', rotate: '2deg', zIndex: 3, top: '0px', left: '90px' },
    { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', label: 'Sneakers', price: '₹3,999', rotate: '5deg', zIndex: 2, top: '30px', left: '185px' },
    { img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200', label: 'Camera', price: '₹45,000', rotate: '-3deg', zIndex: 1, top: '5px', left: '275px' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== HERO SECTION ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary-100">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                Fresh deals every day
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Shop smart,{' '}
                <span className="text-primary-600">save more</span>{' '}
                every day
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Discover amazing products, bargain prices with sellers, and track your spending — all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary flex items-center gap-2 px-8 py-3.5"
                  >
                    Start Shopping <FiArrowRight />
                  </motion.button>
                </Link>
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-secondary flex items-center gap-2 px-8 py-3.5"
                  >
                    <FiTag /> View Deals
                  </motion.button>
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { val: '2.4k+', label: 'Products' },
                  { val: '₹120', label: 'Avg. savings' },
                  { val: '98%', label: 'Happy customers' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold text-gray-900">{s.val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Floating Collage */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden md:block"
            >
              <div className="relative h-64 w-full">
                {collageItems.map((item, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    style={{ position: 'absolute', top: item.top, left: item.left, zIndex: item.zIndex, transform: `rotate(${item.rotate})` }}
                    className="w-[140px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <img src={item.img} alt={item.label} className="w-full h-26 object-cover" />
                    <div className="px-2.5 py-2">
                      <div className="text-xs font-semibold text-gray-700">{item.label}</div>
                      <div className="text-xs text-primary-600 font-bold">{item.price}</div>
                    </div>
                  </motion.div>
                ))}
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-2xl px-4 py-2.5 shadow-lg z-10"
                >
                  <div className="text-xs font-medium opacity-80">Avg. savings</div>
                  <div className="text-lg font-bold">₹120 / order</div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section className="bg-primary-600 text-white py-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">{f.title}</div>
                  <div className="text-xs opacity-70">{f.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-14">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-400 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
            <Link to="/products" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
              All products <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <Link key={i} to={`/products?category=${cat.name}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 h-44"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-75 group-hover:opacity-85 transition-opacity`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-3xl">{cat.emoji}</span>
                    <h3 className="text-white text-lg font-bold">{cat.name}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BARGAIN BANNER ===== */}
      <section className="py-4 pb-14">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <div className="text-2xl font-bold mb-2">🤝 Not happy with the price?</div>
              <p className="text-primary-100 text-sm">Use our unique Bargain feature — send an offer to the seller and negotiate your way to a better deal!</p>
            </div>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:shadow-xl transition-all whitespace-nowrap flex items-center gap-2"
              >
                Try Bargaining <FiArrowRight />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-4 pb-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-400 text-sm mt-1">Handpicked deals just for you</p>
            </div>
            <Link to="/products" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SPENDING REPORT CTA ===== */}
      <section className="py-14 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="text-5xl">📊</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Spending Report</h3>
              <p className="text-gray-500 text-sm">See exactly where your money goes — monthly spending, category breakdown, and savings insights all in one dashboard.</p>
            </div>
            <Link to="/spending-report">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary whitespace-nowrap flex items-center gap-2"
              >
                View My Report <FiArrowRight />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start shopping?</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Join thousands of happy customers and discover amazing deals today!
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-10 py-4 text-lg flex items-center gap-2 mx-auto"
              >
                Browse Products <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;