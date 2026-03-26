import { useState, useEffect } from "react";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const fetchArtistOrders = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const artist = JSON.parse(storedUser);

      const res = await axios.get(
        `http://localhost:5000/api/orders/artist/${artist._id}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching artist orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistOrders();
  }, []);

  const orderCancle = async (order) => {
    const artworkId = order.a_id?._id || order.a_id;

    if (!artworkId) {
      alert("Error: Artwork reference not found on this order.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${order._id}`);
      await axios.patch(`http://localhost:5000/api/artworks/${artworkId}`, {
        isSold: false,
      });

      alert("Order cancelled successfully!");
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
    } catch (err) {
      console.error("Cancellation Error:", err);
      alert("Order was deleted, but failed to update artwork status.");
      fetchArtistOrders();
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "delivered") return order.orderStatus === "delivered";
    if (filter === "pending")
      return order.orderStatus === "shipped" || order.orderStatus === "pending" || order.orderStatus === "placed";
    return true;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        orderStatus: newStatus,
      });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Your Sales Orders</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "pending", "delivered"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl capitalize transition ${
              filter === type
                ? "bg-gray-950 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col bg-white shadow-md rounded-2xl p-6 gap-4 border border-gray-100"
          >
            {/* Top Section: Artwork and Status */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={`http://localhost:5000/${order.a_id?.imageUrl}`}
                  alt={order.title}
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-medium capitalize text-lg text-gray-800">
                    {order.title}
                  </h3>
                  <p className="text-[#ff751f] font-bold">₹{order.price}</p>
                </div>
              </div>

              {/* Custom Styled Dropdown */}
<div className="relative z-10">
  <div className="flex items-center px-3 py-1.5 gap-2">
    <span className="font-semibold text-md">Status: </span>
    <div className="relative">
      <select
        value={order.orderStatus}
        onChange={(e) => handleStatusChange(order._id, e.target.value)}
        // LOCK: Disable if status is delivered OR cancelled
        disabled={order.orderStatus === "delivered"}
        className={`p-2 rounded-lg outline-none font-semibold transition mr-1 
          ${(order.orderStatus === "delivered") 
            ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
            : "bg-gray-200 cursor-pointer"}`}
      >
        <option value="placed">Placed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>

    {/* REMOVE: Hide cancel button if status is delivered OR cancelled */}
    {order.orderStatus !== "delivered" && (
      <div>
        <button
          onClick={() => orderCancle(order)}
          className="bg-red-500 text-white font-semibold px-2 py-1 rounded-md border-0 hover:bg-red-600 cursor-pointer"
        >
          Cancel Order
        </button>
      </div>
    )}
  </div>
</div>
            </div>

            <div className="mt-2 pt-4 border-t border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Customer Information
                </p>
                <p className="text-sm capitalize font-semibold text-gray-700">
                  {order.u_id?.firstName} {order.u_id?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: +91 {order.u_id?.phone || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Delivery Address
                </p>
                <p className="text-sm capitalize text-gray-600 leading-relaxed">
                  {order.u_id?.address || "No address provided"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No {filter !== "all" ? filter : ""} orders found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
