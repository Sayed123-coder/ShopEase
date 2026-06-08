import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTrendingUp, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        {label && <p className="text-xs text-gray-400 mb-1">{label}</p>}
        <p className="text-sm font-bold text-gray-900">₹{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const SpendingReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/orders/spending-report');
      setReport(data);
    } catch (error) {
      toast.error('Failed to load report!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!report || report.totalOrders === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="container-custom py-6">
            <h1 className="text-2xl font-bold text-gray-900">Smart Spending Report</h1>
            <p className="text-gray-400 text-sm mt-1">Track your spending habits</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm mb-6">Place some orders to see your spending report!</p>
            <button onClick={() => navigate('/products')} className="btn-primary flex items-center gap-2 mx-auto">
              <FiShoppingBag size={15} /> Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avgOrderValue = Math.round(report.totalSpent / report.totalOrders);
  const topCategory = report.categorySpending?.sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">Smart Spending Report</h1>
          <p className="text-gray-400 text-sm mt-1">Your complete spending analysis</p>
        </div>
      </div>

      <div className="container-custom py-8 max-w-5xl">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Total Spent',     value: `₹${report.totalSpent?.toLocaleString()}`,  icon: <FiTrendingUp size={18} />,  bg: 'bg-primary-50',  text: 'text-primary-700',  border: 'border-primary-100', iconBg: 'bg-primary-100 text-primary-600' },
            { label: 'Total Orders',    value: report.totalOrders,                          icon: <FiShoppingBag size={18} />, bg: 'bg-green-50',    text: 'text-green-700',    border: 'border-green-100',   iconBg: 'bg-green-100 text-green-600'   },
            { label: 'Avg Order Value', value: `₹${avgOrderValue?.toLocaleString()}`,       icon: <FiBarChart2 size={18} />,   bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-100',   iconBg: 'bg-amber-100 text-amber-600'   },
            { label: 'Top Category',    value: topCategory?.category || 'N/A',              icon: <FiPieChart size={18} />,    bg: 'bg-purple-50',   text: 'text-purple-700',   border: 'border-purple-100',  iconBg: 'bg-purple-100 text-purple-600' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`${card.bg} border ${card.border} rounded-2xl p-4`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
                {card.icon}
              </div>
              <p className="text-xs text-gray-500 font-medium mb-1">{card.label}</p>
              <p className={`text-xl font-bold ${card.text} truncate`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Monthly Spending Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
              <FiBarChart2 size={14} className="text-primary-600" />
            </div>
            Monthly Spending
          </h2>
          <p className="text-xs text-gray-400 mb-5 ml-9">Your spending trend over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report.monthlySpending} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Wise Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
              <FiPieChart size={14} className="text-primary-600" />
            </div>
            Category Wise Spending
          </h2>
          <p className="text-xs text-gray-400 mb-5 ml-9">Where your money is going</p>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={report.categorySpending}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {report.categorySpending.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category breakdown list */}
            <div className="space-y-3">
              {report.categorySpending
                .sort((a, b) => b.amount - a.amount)
                .map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.category}</span>
                        <span className="text-gray-500">₹{cat.amount?.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round((cat.amount / report.totalSpent) * 100)}%`,
                            background: COLORS[i % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {Math.round((cat.amount / report.totalSpent) * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpendingReport;