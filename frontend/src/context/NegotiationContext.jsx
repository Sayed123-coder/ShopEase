// context/NegotiationContext.jsx

import { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const NegotiationContext = createContext();

export const useNegotiation = () => {
  const context = useContext(NegotiationContext);
  if (!context) {
    throw new Error('useNegotiation must be used within NegotiationProvider');
  }
  return context;
};

export const NegotiationProvider = ({ children }) => {
  const [negotiations, setNegotiations] = useState([]);           // User ki apni negotiations
  const [sellerNegotiations, setSellerNegotiations] = useState([]); // Seller ki negotiations
  const [adminNegotiations, setAdminNegotiations] = useState([]);   // Admin ki negotiations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // User offer bheje
  const makeOffer = async (productId, offeredPrice, message) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/negotiations', {
        productId,
        offeredPrice,
        message,
      });
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User apni negotiations dekhe — sirf user state update hogi
  const getMyNegotiations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/negotiations/my');
      setNegotiations(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Admin sabki negotiations dekhe — sirf admin state update hogi
  const getAllNegotiations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/negotiations/all');
      setAdminNegotiations(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Admin/Seller respond kare
  const respondToOffer = async (id, status, counterPrice) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/api/negotiations/${id}`, {
        status,
        counterPrice,
      });
      // Teeno states mein update karo jahan bhi match kare
      setNegotiations((prev) => prev.map((n) => (n._id === id ? data : n)));
      setSellerNegotiations((prev) => prev.map((n) => (n._id === id ? data : n)));
      setAdminNegotiations((prev) => prev.map((n) => (n._id === id ? data : n)));
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductNegotiation = async (productId) => {
    try {
      const { data } = await api.get('/api/negotiations/my');
      const productNegotiations = data.filter(
        (n) => n.product._id === productId
      );
      return productNegotiations;
    } catch (error) {
      return [];
    }
  };

  const rejectCounter = async (id) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/api/negotiations/${id}/reject-counter`);
      setNegotiations((prev) => prev.map((n) => (n._id === id ? data : n)));
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Seller ki negotiations — sirf seller state update hogi, user state safe rahegi
  const getSellerNegotiations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/negotiations/seller');
      setSellerNegotiations(data);
      const pending = data.filter(n => n.status === 'Pending').length;
      setPendingCount(pending);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    negotiations,           // User ki apni negotiations (MyNegotiations page)
    sellerNegotiations,     // Seller ki negotiations (SellerNegotiations page)
    adminNegotiations,      // Admin ki negotiations (AdminNegotiations page)
    loading,
    error,
    pendingCount,
    makeOffer,
    getMyNegotiations,
    getAllNegotiations,
    respondToOffer,
    getProductNegotiation,
    rejectCounter,
    getSellerNegotiations,
  };

  return (
    <NegotiationContext.Provider value={value}>
      {children}
    </NegotiationContext.Provider>
  );
};