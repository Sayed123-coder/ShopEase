import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiShoppingBag, FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Books',
  'Sports', 'Toys', 'Beauty', 'Mobiles', 'Computers', 'Other'
];

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', brand: '', stock: '', images: '',
};

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/seller/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products!');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/seller-orders');
      setSellerOrders(data.data);
    } catch (error) {
      console.log('Orders fetch failed');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    setUploadingImage(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append('image', imageFile);
      const { data } = await api.post('/api/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.imageUrl;
    } catch (error) {
      toast.error('Image upload failed!');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdd = () => {
    setEditProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setImageFile(null);
    setImagePreview(product.images?.[0] || '');
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || '',
      brand: product.brand || '',
      stock: product.stock || '',
      images: product.images?.[0] || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/seller/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error('Delete failed!');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill all required fields!');
      return;
    }
    setSaving(true);
    try {
      let imageUrl = formData.images;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) { setSaving(false); return; }
      }
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        images: imageUrl ? [imageUrl] : [],
      };
      if (editProduct) {
        await api.put(`/api/seller/products/${editProduct._id}`, payload);
        toast.success('Product updated! ✅');
      } else {
        await api.post('/api/seller/products', payload);
        toast.success('Product added for approval! 🎉');
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview('');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

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
        <div className="container-custom py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your products and orders</p>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="container-custom py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Total Products', value: products.length,                               icon: <FiPackage size={18} />,     bg: 'bg-primary-50',  text: 'text-primary-700',  border: 'border-primary-100', iconBg: 'bg-primary-100 text-primary-600' },
            { label: 'Active Products', value: products.filter(p => p.isActive).length,      icon: <FiCheckCircle size={18} />, bg: 'bg-green-50',    text: 'text-green-700',    border: 'border-green-100',   iconBg: 'bg-green-100 text-green-600'   },
            { label: 'Out of Stock',    value: products.filter(p => p.stock === 0).length,   icon: <FiAlertCircle size={18} />, bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-100',   iconBg: 'bg-amber-100 text-amber-600'   },
            { label: 'Total Orders',   value: sellerOrders.length,                           icon: <FiShoppingBag size={18} />, bg: 'bg-purple-50',   text: 'text-purple-700',   border: 'border-purple-100',  iconBg: 'bg-purple-100 text-purple-600' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`${card.bg} border ${card.border} rounded-2xl p-4`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
                {card.icon}
              </div>
              <p className="text-xs text-gray-500 font-medium mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
              {card.label === 'Total Orders' && (
                <Link to="/seller/orders" className="text-xs text-purple-500 hover:underline mt-1 block font-medium">
                  View Orders →
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiPackage size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-400 text-sm mb-6">Add your first product to start selling!</p>
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2 mx-auto">
              <FiPlus size={15} /> Add First Product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-contain p-1.5"
                    onError={e => { e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h2>
                    {!product.isActive && (
                      <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
                        ⏳ Pending Approval
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      product.isActive
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {product.isActive ? '✅ Active' : '⏳ Pending'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border border-primary-200"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border border-red-200"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                  <FiX size={15} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. Sony WH-1000XM5" />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Describe your product..." />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="999" />
                  </div>
                  <div>
                    <label className={labelClass}>Original Price (₹)</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={inputClass} placeholder="1499" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} placeholder="e.g. Sony" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={inputClass} placeholder="10" />
                </div>

                {/* Image Upload */}
                <div>
                  <label className={labelClass}>Product Image</label>
                  {imagePreview && (
                    <div className="mb-3">
                      <img src={imagePreview} alt="preview" className="w-24 h-24 object-contain bg-gray-50 rounded-xl border border-gray-200 p-2" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                  />
                  {uploadingImage && <p className="text-xs text-primary-600 mt-1.5 font-medium">⏳ Uploading image...</p>}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={handleSubmit}
                  disabled={saving || uploadingImage}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Saving...</>
                    : editProduct ? '✅ Update Product' : '🚀 Add Product'
                  }
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SellerDashboard;