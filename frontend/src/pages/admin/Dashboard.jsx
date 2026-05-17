import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loading-spinner"></div></div>;

  const statCards = [
  { title: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'bg-blue-500', link: '/admin/users' },
  { title: 'Total Products', value: stats?.totalProducts || 0, icon: <FiPackage />, color: 'bg-green-500', link: '/admin/products' },
  { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag />, color: 'bg-purple-500', link: '/admin/orders' },
  { title: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: <FiDollarSign />, color: 'bg-amber-500', link: '/admin/orders' },
  {  title: 'Pending Products',  value: stats?.pendingProducts || 0,  icon: <FiPackage />,  color: 'bg-orange-500',  link: '/admin/products' 
},
];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link to="/admin/products"><button className="btn-primary">Manage Products</button></Link>
            <Link to="/admin/orders"><button className="btn-secondary">Manage Orders</button></Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link to={stat.link} key={index}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
           <div className="flex items-center justify-between">
           <div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
           </div>
              <div className={`${stat.color} text-white p-4 rounded-lg text-2xl`}>
              {stat.icon}
              </div>
            </div>
           </div>
          </Link>
           ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4 font-semibold">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
