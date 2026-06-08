import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiPackage } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Toys', 'Beauty', 'Mobiles', 'Computers', 'Other'];

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [pendingProducts, setPendingProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: 'Electronics', brand: '', stock: '', images: '',
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products/admin/all');
      setProducts(data.data);
      const pending = data.data.filter(p => !p.isActive);
      const active = data.data.filter(p => p.isActive);
      setPendingProducts(pending);
      const grouped = {};
      active.forEach(p => {
        const sellerName = p.seller?.name || 'Unknown Seller';
        if (!grouped[sellerName]) grouped[sellerName] = [];
        grouped[sellerName].push(p);
      });
      setGroupedProducts(grouped);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    setUploadingImage(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append('image', imageFile);
      const { data } = await api.post('/api/upload', formDataImg, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data.imageUrl;
    } catch (error) {
      toast.error('Image upload failed!');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = formData.images;
      if (imageFile) { imageUrl = await uploadImage(); if (!imageUrl) { setSaving(false); return; } }
      const payload = { ...formData, price: Number(formData.price), originalPrice: Number(formData.originalPrice) || 0, stock: Number(formData.stock), images: imageUrl ? [imageUrl] : [] };
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, payload);
        toast.success('Product updated! ✅');
      } else {
        await api.post('/api/products', payload);
        toast.success('Product created! 🎉');
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        toast.success('Product deleted!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product.images?.[0] || '');
    setFormData({ name: product.name, description: product.description, price: product.price, originalPrice: product.originalPrice, category: product.category, brand: product.brand, stock: product.stock, images: product.images?.[0] || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', originalPrice: '', category: 'Electronics', brand: '', stock: '', images: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleApproveProduct = async (id) => {
    try {
      await api.put(`/api/admin/products/${id}/approve`);
      toast.success('Product approved! ✅');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to approve!');
    }
  };

  const handleRejectProduct = async (id) => {
    if (!window.confirm('Reject and delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}/reject`);
      toast.success('Product rejected!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to reject!');
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
        <div className="container-custom py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} total products · {pendingProducts.length} pending approval</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditingProduct(null); resetForm(); }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="container-custom py-8">

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-7"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-lg">{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
                <button onClick={() => { setShowForm(false); setEditingProduct(null); resetForm(); }} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                  <FiX size={15} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Product Name *</label>
                    <input required type="text" placeholder="e.g. iPhone 15 Pro" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Brand</label>
                    <input type="text" placeholder="e.g. Apple" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <input required type="number" placeholder="999" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Original Price (₹)</label>
                    <input type="number" placeholder="1499" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass}>
                      {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Stock *</label>
                    <input required type="number" placeholder="10" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description *</label>
                    <textarea required placeholder="Describe the product..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} resize-none`} rows={3} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Product Image</label>
                    {imagePreview && (
                      <img src={imagePreview} alt="preview" className="w-20 h-20 object-contain bg-gray-50 rounded-xl border border-gray-200 p-2 mb-3" />
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
                    {uploadingImage && <p className="text-xs text-primary-600 mt-1.5">⏳ Uploading image...</p>}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button type="submit" disabled={saving || uploadingImage} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                    {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Saving...</> : editingProduct ? '✅ Update Product' : '🚀 Create Product'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); resetForm(); }} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending Approval */}
        <AnimatePresence>
          {pendingProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-6 mb-6"
            >
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center text-sm">⏳</span>
                Pending Approval
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingProducts.length}</span>
              </h2>
              <div className="space-y-3">
                {pendingProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={product.images?.[0] || 'https://placehold.co/300x300?text=?'} alt={product.name} className="w-full h-full object-contain p-1" onError={e => { e.target.src = 'https://placehold.co/300x300?text=?'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.category} · ₹{product.price?.toLocaleString()} · Seller: <span className="font-medium text-primary-600">{product.seller?.name || 'Unknown'}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleApproveProduct(product._id)} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors">
                        <FiCheck size={13} /> Approve
                      </button>
                      <button onClick={() => handleRejectProduct(product._id)} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors">
                        <FiX size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Products — Seller Wise */}
        {Object.entries(groupedProducts).map(([sellerName, sellerProducts]) => (
          <div key={sellerName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
            <div className="bg-primary-50 border-b border-primary-100 px-6 py-3.5 flex justify-between items-center">
              <h2 className="font-bold text-primary-700 flex items-center gap-2">
                <span>🏪</span> {sellerName}
              </h2>
              <span className="text-xs text-primary-500 font-medium bg-primary-100 px-2.5 py-1 rounded-full">{sellerProducts.length} products</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.map((product, i) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={product.images?.[0] || 'https://placehold.co/300x300?text=?'} alt={product.name} className="w-full h-full object-contain p-1.5" onError={e => { e.target.src = 'https://placehold.co/300x300?text=?'; }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm text-gray-500">{product.category}</td>
                      <td className="py-4 px-5 text-sm font-semibold text-gray-900">₹{product.price?.toLocaleString()}</td>
                      <td className="py-4 px-5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          product.stock > 10 ? 'bg-green-50 text-green-700 border-green-200' :
                          product.stock > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(product)} className="w-8 h-8 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center transition-colors border border-primary-200">
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors border border-red-200">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {Object.keys(groupedProducts).length === 0 && pendingProducts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiPackage size={32} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-400 text-sm mb-6">Add your first product to get started!</p>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <FiPlus size={15} /> Add Product
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageProducts;