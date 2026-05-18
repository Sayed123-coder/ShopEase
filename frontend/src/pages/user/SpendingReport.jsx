import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const SpendingReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!report || report.totalOrders === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-4xl mb-4">📊</p>
        <p className="text-lg">No Orders Found</p>
        <p className="text-sm">Order something to see the report</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">💰 Smart Spending Report</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
          <p className="text-sm text-indigo-500 font-medium">Total Spent</p>
          <p className="text-3xl font-bold text-indigo-700">₹{report.totalSpent}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <p className="text-sm text-green-500 font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-green-700">{report.totalOrders}</p>
        </div>
      </div>

      {/* Monthly Spending Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">📅 Monthly Spending</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.monthlySpending}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Wise Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">🗂️ Category Wise Spending</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={report.categorySpending}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ category, percent }) =>
                `${category} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {report.categorySpending.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingReport;