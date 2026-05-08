import { useEffect, useState } from 'react';
import { useNegotiation } from '../../context/NegotiationContext';
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

const SellerNegotiations = () => {
  const { negotiations, loading, getSellerNegotiations, respondToOffer } = useNegotiation();
  const [counterPrice, setCounterPrice] = useState({});

  useEffect(() => {
    getSellerNegotiations();
  }, []);

  const handleRespond = async (id, status) => {
    try {
      await respondToOffer(id, status, counterPrice[id]);
      toast.success(`Offer ${status} successfully!`);
      getSellerNegotiations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Product Negotiations 🤝</h1>

      {negotiations.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No negotiations yet!</p>
      ) : (
        <div className="space-y-4">
          {negotiations.map((n) => (
            <div key={n._id} className="border rounded-lg p-4 shadow-sm bg-white">

              {/* Product + User Info */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={n.product?.images?.[0]}
                  alt={n.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{n.product?.name}</h2>
                  <p className="text-gray-500 text-sm">
                    Buyer: {n.user?.name} ({n.user?.email})
                  </p>
                  <p className="text-gray-500 text-sm">
                    Original Price: ₹{n.originalPrice}
                  </p>
                </div>
              </div>

              {/* Negotiation Info */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <p>Buyer Offer: <span className="font-semibold">₹{n.offeredPrice}</span></p>
                {n.counterPrice && (
                  <p>Counter Price: <span className="font-semibold text-blue-600">₹{n.counterPrice}</span></p>
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

              {/* Actions - only if Pending */}
              {n.status === 'Pending' && (
                <div className="flex flex-wrap gap-2 items-center mt-3">

                  {/* Accept */}
                  <button
                    onClick={() => handleRespond(n._id, 'Accepted')}
                    className="bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 text-sm"
                  >
                    Accept ✅
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() => handleRespond(n._id, 'Rejected')}
                    className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
                  >
                    Reject ❌
                  </button>

                  {/* Counter */}
                  <input
                    type="number"
                    placeholder="Counter price"
                    value={counterPrice[n._id] || ''}
                    onChange={(e) =>
                      setCounterPrice((prev) => ({ ...prev, [n._id]: e.target.value }))
                    }
                    className="border rounded px-3 py-1.5 text-sm w-36"
                  />
                  <button
                    onClick={() => handleRespond(n._id, 'Countered')}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 text-sm"
                  >
                    Counter 🔄
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

export default SellerNegotiations;