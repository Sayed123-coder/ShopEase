import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const statusConfig = {
  Delivered:  { color: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500'  },
  Shipped:    { color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500'   },
  Processing: { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Pending:    { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  Cancelled:  { color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500'    },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/admin/stats');
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users',       value: stats?.totalUsers || 0,                    icon: <FiUsers size={20} />,       bg: 'bg-primary-50',  text: 'text-primary-700',  border: 'border-primary-100', iconBg: 'bg-primary-100 text-primary-600', link: '/admin/users'    },
    { title: 'Total Products',    value: stats?.totalProducts || 0,                 icon: <FiPackage size={20} />,     bg: 'bg-green-50',    text: 'text-green-700',    border: 'border-green-100',   iconBg: 'bg-green-100 text-green-600',    link: '/admin/products' },
    { title: 'Total Orders',      value: stats?.totalOrders || 0,                   icon: <FiShoppingBag size={20} />, bg: 'bg-purple-50',   text: 'text-purple-700',   border: 'border-purple-100',  iconBg: 'bg-purple-100 text-purple-600',  link: '/admin/orders'   },
    { title: 'Total Revenue',     value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign size={20} />,  bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-100',   iconBg: 'bg-amber-100 text-amber-600',    link: '/admin/orders'   },
    { title: 'Pending Products',  value: stats?.pendingProducts || 0,               icon: <FiAlertCircle size={20} />, bg: 'bg-orange-50',   text: 'text-orange-700',   border: 'border-orange-100',  iconBg: 'bg-orange-100 text-orange-600',  link: '/admin/products' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/products">
              <button className="btn-primary flex items-center gap-2 text-sm py-2.5">
                <FiPackage size={15} /> Manage Products
              </button>
            </Link>
            <Link to="/admin/orders">
              <button className="btn-secondary flex items-center gap-2 text-sm py-2.5">
                <FiShoppingBag size={15} /> Manage Orders
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-7">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={card.link}>
                <div className={`${card.bg} border ${card.border} rounded-2xl p-4 hover:shadow-md transition-all group cursor-pointer`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-400">View</span>
                    <FiArrowRight size={11} className="text-gray-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { label: 'Manage Users',        icon: '👥', link: '/admin/users'        },
            { label: 'Manage Products',     icon: '📦', link: '/admin/products'     },
            { label: 'Manage Orders',       icon: '🛒', link: '/admin/orders'       },
            { label: 'All Negotiations',    icon: '🤝', link: '/admin/negotiations' },
          ].map((item, i) => (
            <Link key={i} to={item.link}>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-sm transition-all flex items-center gap-3 group">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">{item.label}</span>
                <FiArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                <FiShoppingBag size={14} className="text-primary-600" />
              </div>
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order, i) => {
                  const status = statusConfig[order.orderStatus] || statusConfig.Pending;
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-5 font-mono text-xs text-gray-500">{order._id.substring(0, 10)}...</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {order.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{order.user?.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm font-semibold text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                      <td className="py-4 px-5">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;