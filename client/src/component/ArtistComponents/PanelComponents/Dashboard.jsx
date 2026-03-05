import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalSold: 0,
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const artistId = user?._id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [artworksRes, ordersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/artworks/artist/${artistId}`),
          axios.get(`http://localhost:5000/api/orders/artist/${artistId}`),
        ]);

        const artworks = artworksRes.data;
        const orders = ordersRes.data;

        const totalArtworksCount = artworks.length;
        const pendingCount = orders.filter(
          (o) => o.orderStatus === "placed"
        ).length;
        const deliveredOrders = orders.filter(
          (o) => o.orderStatus === "delivered"
        );
        const totalSold = deliveredOrders.length;
        const revenue = deliveredOrders.reduce(
          (sum, order) => sum + (order.price || 0),
          0
        );
        setStats({
          totalArtworks: totalArtworksCount,
          pendingOrders: pendingCount,
          totalRevenue: revenue,
          totalSold: totalSold,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) fetchDashboardData();
  }, [artistId]);

  const StatCard = ({ title, value, color, prefix = "" }) => (
    <div
      className={`bg-white p-8 rounded-2xl shadow-md border-l-4 ${color} hover:shadow-xl transition`}
    >
      <h2 className="text-gray-500 text-lg font-medium">{title}</h2>
      <p className="text-4xl font-bold mt-4 text-gray-800">
        {loading ? (
          <span className="inline-block w-12 h-8 bg-gray-200 animate-pulse rounded"></span>
        ) : (
          `${prefix}${value.toLocaleString()}`
        )}
      </p>
    </div>
  );

  return (
    <div className="w-full min-h-[90%] bg-gray-100 p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.firstName} {user?.lastName}.
        </h1>
        <p className="text-gray-500 mt-2">Here's your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard
          title="Total Artworks"
          value={stats.totalArtworks}
          color="border-[#ff751f]"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingOrders}
          color="border-yellow-500"
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          color="border-green-500"
          prefix="₹"
        />
        <StatCard
          title="Artworks Sold"
          value={stats.totalSold}
          color="border-blue-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
