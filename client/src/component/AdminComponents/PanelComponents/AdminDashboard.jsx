import React, { useEffect, useState } from "react";
import userBaseUrl from "../../../axioInstance";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSold: 0,
    totalRevenue: 0,
    totalArtists: 0,
    totalCustomers: 0,
    ongoingOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [artworksRes, ordersRes, usersRes] = await Promise.allSettled([
          userBaseUrl.get("/artworks"), 
          userBaseUrl.get("/orders"), 
          userBaseUrl.get("/users"), 
        ]);

        const artworks = artworksRes.status === 'fulfilled' ? (artworksRes.value.data || []) : [];
        const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []) : [];
        const users = usersRes.status === 'fulfilled' ? (usersRes.value.data || []) : [];

        setStats({
          totalArtworks: artworks.length,
          totalSold: artworks.filter(a => a.isSold).length,
          totalArtists: users.filter(u => u.role === "artist").length,
          totalCustomers: users.filter(u => u.role === "customer").length,
          ongoingOrders: orders.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length,
          deliveredOrders: orders.filter(o => o.orderStatus === "delivered").length,
          totalRevenue: orders
            .filter(o => o.paymentStatus === "paid")
            .reduce((sum, order) => sum + (order.price || 0), 0),
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const StatCard = ({ title, value, color, prefix = "" }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 ${color} hover:shadow-md transition`}>
      <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h2>
      <p className="text-3xl font-bold mt-2 text-gray-800">
        {loading ? <span className="animate-pulse">...</span> : `${prefix}${value.toLocaleString()}`}
      </p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600">Real time stats for the entire marketplace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Artworks" value={stats.totalArtworks} color="border-[#ff751f]" />
        <StatCard title="Artworks Sold" value={stats.totalSold} color="border-blue-500" />
        <StatCard title="Total Revenue" value={stats.totalRevenue} color="border-green-500" prefix="₹" />
        <StatCard title="Total Artists" value={stats.totalArtists} color="border-purple-500" />
        <StatCard title="Customers" value={stats.totalCustomers} color="border-pink-500" />
        <StatCard title="Ongoing Orders" value={stats.ongoingOrders} color="border-yellow-500" />
        <StatCard title="Delivered" value={stats.deliveredOrders} color="border-teal-500" />
      </div>
    </div>
  );
};

export default AdminDashboard;