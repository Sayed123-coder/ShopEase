import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useNegotiation } from "../../context/NegotiationContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { makeOffer, loading: negotiationLoading, getProductNegotiation } = useNegotiation();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [negotiationStatus, setNegotiationStatus] = useState(null); // current status
  const [offerCount, setOfferCount] = useState(0);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      toast.error("There is an error in loading products");
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationStatus = async () => {
    if (!isAuthenticated) return;
    const negotiations = await getProductNegotiation(id);
    setOfferCount(negotiations.length);

    // Latest negotiation status
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
      fetchNegotiationStatus(); // status refresh karo
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  // Offer button render karo status ke hisaab se
  const renderOfferButton = () => {
    if (offerCount >= 3) {
      return (
        <button disabled className="w-full mt-3 py-3 bg-gray-300 text-gray-600 font-semibold rounded cursor-not-allowed">
          Offer Limit Reached ❌
        </button>
      );
    }

    switch (negotiationStatus) {
      case 'Pending':
        return (
          <button
            onClick={() => navigate('/my-negotiations')}
            className="w-full mt-3 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded"
          >
            Offer Sent ⏳
          </button>
        );
      case 'Accepted':
        return (
          <button
            onClick={() => navigate('/my-negotiations')}
            className="w-full mt-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
          >
            Offer Accepted ✅
          </button>
        );
      case 'Countered':
        return (
          <button
            onClick={() => navigate('/my-negotiations')}
            className="w-full mt-3 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded"
          >
            Counter Received 🔔
          </button>
        );
      case 'Rejected':
        return (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-3 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded"
          >
            Make an Offer 🤝
          </button>
        );
      default:
        return (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-3 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded"
          >
            Make an Offer 🤝
          </button>
        );
    }
  };

  const { addToCart,cartItems} = useCart();
  const isInCart = cartItems.some(item => item._id === product?._id);

  const handleAddToCart = () => {
    if (product.stock === 0) {
     toast.error('Product out of stock! ❌');
     return;
   }
  addToCart({
    _id: product._id,
    name: product.name,
    price: product.price,
    images: product.images,
    category: product.category,
    stock: product.stock,
  }, 1);
  toast.success('Added to cart! 🛒');
};

const handleBuyNow = () => {
  handleAddToCart();
  navigate('/checkout');
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container-custom">

        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 text-sm"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6">

          {/* LEFT – Image */}
          <div>
            <div className="border rounded p-4 flex justify-center">
              <img
                src={product.images}
                alt={product.name}
                className="h-80 object-contain"
              />
            </div>

            {/* CTA Buttons */}
             <div className="flex gap-4 mt-4">
               {isInCart ? (
                <button
                 onClick={() => navigate('/cart')}
                 className="w-1/2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
                >
                🛒 Go to Cart
             </button>
             ) : (
             <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-1/2 py-3 font-semibold rounded ${
              product.stock === 0
                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                 : 'bg-yellow-400 hover:bg-yellow-500 text-black'
              }`}
           >
           {product.stock === 0 ? 'Out of Stock ❌' : '🛒 Add to Cart'}
          </button>
            )}
          <button
           onClick={handleBuyNow}
           disabled={product.stock === 0}
           className={`w-1/2 py-3 font-semibold rounded ${
           product.stock === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
          >
        {product.stock === 0 ? 'Out of Stock ❌' : '⚡ Buy Now'}
      </button>
       </div>

            {/* Offer Button */}
            {renderOfferButton()}
          </div>

          {/* RIGHT – Details */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">
                ⭐ {product.rating || "N/A"}
              </span>
              <span className="text-gray-500 text-sm">Ratings & Reviews</span>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-1">
              ₹{product.price}
            </p>
            <p className="text-green-600 text-sm mb-4">Inclusive of all taxes</p>

             {product.stock === 0 ? (
              <p className="text-red-500 font-semibold text-sm mb-4">❌ Out of Stock</p>
               ) : product.stock <= 5 ? (
              <p className="text-orange-500 font-semibold text-sm mb-4">⚠️ Sirf {product.stock} bacha hai!</p>
              ) : (
              <p className="text-green-600 font-semibold text-sm mb-4">✅ In Stock</p>
            )}

            <div className="border rounded p-4 mb-5 bg-gray-50">
              <h3 className="font-semibold mb-2">Available Offers</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✔ 10% instant discount on Axis Bank Cards</li>
                <li>✔ No Cost EMI available</li>
                <li>✔ Special Price for limited time</li>
              </ul>
            </div>

            <div className="mb-5">
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>

            <p className="text-sm text-gray-500">
              Category: <span className="font-medium">{product.category}</span>
            </p>
          </div>

        </div>
      </div>

      {/* Offer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Make an Offer 🤝</h2>

            <p className="text-gray-500 text-sm mb-1">
              Original Price: <span className="font-semibold text-gray-800">₹{product.price}</span>
            </p>
            <p className="text-gray-400 text-xs mb-4">
              Offers remaining: {3 - offerCount}/3
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Offer Price (₹)</label>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                placeholder={`Less than ₹${product.price}`}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please give me some discount... 😄"
                rows={3}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMakeOffer}
                disabled={negotiationLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold disabled:opacity-50"
              >
                {negotiationLoading ? 'Sending...' : 'Send Offer 🚀'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-semibold"
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

export default ProductDetails;