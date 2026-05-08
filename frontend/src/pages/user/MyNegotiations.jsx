import { useEffect } from 'react';
import { useNegotiation } from '../../context/NegotiationContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Accepted': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    case 'Countered': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MyNegotiations = () => {
  const { negotiations, loading, getMyNegotiations, rejectCounter } = useNegotiation();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getMyNegotiations();
  }, []);

  const handleBuyNow = (negotiation) => {
    const price =
      negotiation.status === 'Countered'
        ? negotiation.counterPrice
        : negotiation.offeredPrice;

    addToCart(
      {
        ...negotiation.product,
        _id: negotiation.product._id,
        price: price,
        name: negotiation.product.name,
        image: negotiation.product.images?.[0],
      },
      1
    );

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

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Negotiations 🤝</h1>

      {negotiations.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No negotiations yet!</p>
      ) : (
        <div className="space-y-4">
          {negotiations.map((n) => (
            <div key={n._id} className="border rounded-lg p-4 shadow-sm">

              {/* Product Info */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={n.product?.images?.[0]}
                  alt={n.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{n.product?.name}</h2>
                  <p className="text-gray-500 text-sm">
                    Original Price: ₹{n.originalPrice}
                  </p>
                </div>
              </div>

              {/* Negotiation Info */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <p>Your Offer: <span className="font-semibold">₹{n.offeredPrice}</span></p>
                {n.counterPrice && (
                  <p>Counter Offer: <span className="font-semibold text-blue-600">₹{n.counterPrice}</span></p>
                )}
                {n.message && (
                  <p className="col-span-2 text-gray-500">Message: {n.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(n.status)}`}>
                  {n.status}
                </span>
              </div>

              {/* Rejected — info message */}
              {n.status === 'Rejected' && (
                <p className="text-sm text-red-500">
                  ❌ Offer rejected — You can make a new offer on the product page!
                </p>
              )}

              {/* Accepted — Buy button */}
              {n.status === 'Accepted' && (
                <button
                  onClick={() => handleBuyNow(n)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold text-sm"
                >
                  🛒 Buy at ₹{n.offeredPrice}
                </button>
              )}

              {/* Countered — Accept or Reject */}
              {n.status === 'Countered' && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleBuyNow(n)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm"
                  >
                    ✅ Accept & Buy at ₹{n.counterPrice}
                  </button>
                  <button
                    onClick={() => handleRejectCounter(n)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded font-semibold text-sm"
                  >
                    ❌ Reject Counter
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNegotiations;