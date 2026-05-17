import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Books',
  'Sports', 'Toys', 'Beauty', 'Mobiles', 'Computers', 'Other'
];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  brand: '',
  stock: '',
  images: '',
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
      toast.error('Products load nahi ho paye!');
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      toast.success('Product deleted! 🗑️');
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
        if (!imageUrl) {
          setSaving(false);
          return;
        }
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
        toast.success('Product added! 🎉');
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

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏪 Seller Dashboard</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-500">Total Products</p>
          <p className="text-3xl font-bold text-indigo-700">{products.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-500">Active Products</p>
          <p className="text-3xl font-bold text-green-700">
            {products.filter(p => p.isActive).length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-500">Out of Stock</p>
          <p className="text-3xl font-bold text-yellow-700">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-500">Total Orders</p>
          <p className="text-3xl font-bold text-purple-700">{sellerOrders.length}</p>
          <Link
            to="/seller/orders"
            className="text-xs text-purple-500 hover:underline mt-1 block"
          >
            View Orders →
          </Link>
        </div>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-lg">No products yet!</p>
          <button
            onClick={handleAdd}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white border rounded-lg p-4 shadow-sm flex items-center gap-4">

              {/* Image */}
              <img
                src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category} • {product.brand}</p>
                <div className="flex gap-3 mt-1 text-sm">
                  <span className="font-bold text-gray-800">₹{product.price}</span>
                  <span className="text-gray-500">Stock: {product.stock}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded text-sm font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-sm font-semibold"
                >
                  🗑️ Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editProduct ? '✏️ Edit Product' : '➕ Add Product'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {uploadingImage && <p className="text-xs text-indigo-500 mt-1">Uploading...</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                disabled={saving || uploadingImage}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SellerDashboard;