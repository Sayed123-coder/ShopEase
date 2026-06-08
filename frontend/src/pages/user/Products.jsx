import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../../utils/api';
import ProductCard from '../../components/user/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
    sort: 'createdAt',
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All', 'Electronics', 'Fashion', 'Home & Kitchen',
    'Books', 'Sports', 'Toys', 'Beauty', 'Mobiles', 'Computers',
  ];

  const categoryEmojis = {
    'All': '🛍️', 'Electronics': '💻', 'Fashion': '👗',
    'Home & Kitchen': '🏠', 'Books': '📚', 'Sports': '⚽',
    'Toys': '🧸', 'Beauty': '💄', 'Mobiles': '📱', 'Computers': '🖥️',
  };

  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    const categoryFromUrl = searchParams.get('category') || 'All';
    setFilters(prev => ({ ...prev, search: searchFromUrl, category: categoryFromUrl }));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await api.get('/api/products', { params });
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: 'All', minPrice: '', maxPrice: '', search: '', sort: 'createdAt' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category !== 'All' || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== TOP BAR ===== */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {loading ? 'Loading...' : `${products.length} products found`}
                {filters.search && <span className="text-primary-600 font-medium"> for "{filters.search}"</span>}
                {filters.category !== 'All' && <span className="text-primary-600 font-medium"> in {filters.category}</span>}
              </p>
            </div>

            {/* Sort + Mobile Filter */}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${showFilters ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                <FiFilter size={14} />
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
              </button>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  <FiX size={14} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                  filters.category === cat
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                <span>{categoryEmojis[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container-custom py-8">
        <div className="flex gap-7">

          {/* ===== SIDEBAR ===== */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <FiFilter size={15} className="text-primary-600" /> Filters
                </h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-medium">
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="input-field pl-9 text-sm"
                  />
                  {filters.search && (
                    <button onClick={() => handleFilterChange('search', '')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field text-sm appearance-none pr-8"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryEmojis[cat]} {cat}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min ₹"
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max ₹"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Sort (sidebar) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="input-field text-sm appearance-none pr-8"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* ===== PRODUCTS GRID ===== */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-5">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary flex items-center gap-2">
                  <FiX size={15} /> Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;