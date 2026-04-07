import { useState, useEffect } from "react";
import userBaseUrl from "../../../axioInstance";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchArtistOrders = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const artist = JSON.parse(storedUser);

      const res = await userBaseUrl.get(`/orders/artist/${artist._id}`);

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

  const filteredOrders = orders.filter((order) => {
    if (filter === "delivered") return order.orderStatus === "delivered";
    if (filter === "cancelled") return order.orderStatus === "cancelled";

    if (filter === "pending") {
      return order.orderStatus === "shipped" || order.orderStatus === "placed";
    }

    return true;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const isDelivered = newStatus === "delivered";

      const updateData = {
        orderStatus: newStatus,
        ...(isDelivered && { paymentStatus: "paid" }),
      };
      await userBaseUrl.put(`/orders/${orderId}`, updateData);

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, ...updateData } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Your Sales Orders</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {["all", "pending", "delivered", "cancelled"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl capitalize transition shrink-0 ${
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
                  src={order.a_id?.imageUrl}
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
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={
                        order.orderStatus === "delivered" ||
                        order.orderStatus === "cancelled" ||
                        order.orderStatus === "pending"
                      }
                      className={`p-2 rounded-lg outline-none font-semibold transition mr-1 
                        ${
                          order.orderStatus === "delivered"
                            ? "bg-green-200 text-green-800 cursor-not-allowed"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-200 text-red-800 cursor-not-allowed"
                            : order.orderStatus === "pending"
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-gray-200 cursor-pointer hover:border-b-2 border-gray-400"
                        }`}
                    >
                      <option disabled value="pending">
                        Pending
                      </option>
                      <option value="placed">Placed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
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
                <p className="text-sm text-gray-600">
                  Email: {order.u_id?.email || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Delivery Address
                </p>
                <p className="text-sm capitalize text-gray-600 leading-relaxed">
                  {order.u_id?.address || "No address provided"}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Method: {order.paymentMethod}
                </p>
                <p
                  className={`text-xs font-bold uppercase ${
                    order.paymentStatus === "paid"
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  Payment: {order.paymentStatus}
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
