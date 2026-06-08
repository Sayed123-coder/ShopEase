// pages/admin/AdminNegotiations.jsx

import { useEffect, useState } from 'react';
import { useNegotiation } from '../../context/NegotiationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusConfig = {
  Pending:   { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  Accepted:  { color: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500'  },
  Rejected:  { color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500'    },
  Countered: { color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500'   },
};

const AdminNegotiations = () => {
  // ✅ adminNegotiations use karo — negotiations nahi
  const { adminNegotiations, loading, getAllNegotiations, respondToOffer } = useNegotiation();
  const [counterPrice, setCounterPrice] = useState({});

  useEffect(() => {
    getAllNegotiations();
  }, []);

  const handleRespond = async (id, status) => {
    try {
      await respondToOffer(id, status, counterPrice[id]);
      toast.success(`Offer ${status} successfully!`);
      getAllNegotiations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
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
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">All Negotiations</h1>
          <p className="text-gray-400 text-sm mt-1">
            {adminNegotiations.length > 0
              ? `${adminNegotiations.length} total negotiation${adminNegotiations.length > 1 ? 's' : ''}`
              : 'No negotiations yet'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-5xl">

        {/* Empty State */}
        {adminNegotiations.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
              🤝
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No negotiations yet</h3>
            <p className="text-gray-400 text-sm">All buyer-seller negotiations will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {adminNegotiations.map((n, i) => {
                const status = statusConfig[n.status] || statusConfig.Pending;
                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex gap-4">

                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                        <img
                          src={n.product?.images?.[0]}
                          alt={n.product?.name}
                          className="w-full h-full object-contain p-2"
                          onError={e => { e.target.src = 'https://placehold.co/100x100?text=?'; }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">

                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h2 className="font-semibold text-gray-900 text-sm line-clamp-1">{n.product?.name}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Buyer: <span className="font-medium text-gray-600">{n.user?.name}</span> · {n.user?.email}
                            </p>
                          </div>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {n.status}
                          </span>
                        </div>

                        {/* Price boxes */}
                        <div className="flex flex-wrap gap-3 mb-3">
                          <div className="bg-gray-50 rounded-xl px-3 py-2">
                            <div className="text-xs text-gray-400">Original Price</div>
                            <div className="text-sm font-bold text-gray-900">₹{n.originalPrice?.toLocaleString()}</div>
                          </div>
                          <div className="bg-primary-50 rounded-xl px-3 py-2 border border-primary-100">
                            <div className="text-xs text-primary-500">Buyer Offer</div>
                            <div className="text-sm font-bold text-primary-700">₹{n.offeredPrice?.toLocaleString()}</div>
                          </div>
                          {n.counterPrice && (
                            <div className="bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
                              <div className="text-xs text-blue-500">Counter Price</div>
                              <div className="text-sm font-bold text-blue-700">₹{n.counterPrice?.toLocaleString()}</div>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        {n.message && (
                          <p className="text-xs text-gray-400 italic mb-3">"{n.message}"</p>
                        )}

                        {/* Actions - only if Pending */}
                        {n.status === 'Pending' && (
                          <div className="flex flex-wrap gap-2 items-center">
                            <button
                              onClick={() => handleRespond(n._id, 'Accepted')}
                              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                            >
                              <FiCheck size={13} /> Accept
                            </button>
                            <button
                              onClick={() => handleRespond(n._id, 'Rejected')}
                              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                            >
                              <FiX size={13} /> Reject
                            </button>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Counter price ₹"
                                value={counterPrice[n._id] || ''}
                                onChange={(e) => setCounterPrice((prev) => ({ ...prev, [n._id]: e.target.value }))}
                                className="input-field text-sm w-36 py-2"
                              />
                              <button
                                onClick={() => handleRespond(n._id, 'Countered')}
                                className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4"
                              >
                                <FiRefreshCw size={13} /> Counter
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNegotiations;