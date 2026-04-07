import { useState, useEffect } from "react";
import userBaseUrl from "../../../axioInstance";
import { Trash2 } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await userBaseUrl.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching all orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete the order record."
      )
    )
      return;
    try {
      await userBaseUrl.delete(`/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      alert("Failed to delete order");
    }
  };

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

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "delivered") return order.orderStatus === "delivered";
    if (filter === "cancelled") return order.orderStatus === "cancelled";
    if (filter === "pending") {
      return (
        order.orderStatus !== "delivered" && order.orderStatus !== "cancelled"
      );
    }
    return true;
  });

  const formatCustomDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    const pad = (num) => num.toString().padStart(2, "0");

    const ss = pad(date.getSeconds());
    const min = pad(date.getMinutes());
    const hh = pad(date.getHours());
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();

    return `${ss}:${min}:${hh} ${dd}/${mm}/${yyyy}`;
  };

  if (loading)
    return <div className="p-6 text-center">Loading platform orders...</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Platform Order Management
        </h2>
        <span className="text-sm text-gray-500 font-medium">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {["all", "pending", "delivered", "cancelled"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-xl capitalize transition font-medium whitespace-nowrap ${
              filter === type
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Artwork Info */}
              <div className="flex items-center gap-4">
                <img
                  src={order.imageUrl}
                  alt={order.title}
                  className="w-20 h-20 object-cover rounded-2xl border"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">
                    {order.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    By {order.artistName}
                  </p>
                  <p className="text-[#ff751f] font-black text-lg">
                    ₹{order.price}
                  </p>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                <span className="text-sm font-semibold text-black ml-2">
                  Status:{" "}
                </span>
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`p-2 rounded-lg outline-none font-semibold transition mr-1 
                  ${
                    order.orderStatus === "delivered"
                      ? "bg-green-200 text-green-800 hover:border-b-2 border-gray-400"
                      : order.orderStatus ===
                        "cancelled hover:border-b-2 border-gray-400"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 cursor-pointer hover:border-b-2 border-gray-400"
                  }`}
                >
                  <option className="bg-white text-black" value="pending">
                    Pending
                  </option>
                  <option className="bg-white text-black" value="placed">
                    Placed
                  </option>
                  <option className="bg-white text-black" value="shipped">
                    Shipped
                  </option>
                  <option className="bg-white text-black" value="delivered">
                    Delivered
                  </option>
                  <option className="bg-white text-black" value="cancelled">
                    Cancelled
                  </option>
                </select>

                {/* Global Delete Button */}
                <button
                  onClick={() => handleDelete(order._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Delete Record"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Customer
                </p>
                <p className="font-bold text-gray-700">
                  {order.u_id?.firstName} {order.u_id?.lastName}
                </p>
                <p className="text-sm text-gray-500">{order.u_id?.email}</p>
                <p className="text-sm text-gray-500">{order.u_id?.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Shipping Address
                </p>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  {order.u_id?.address || "No address on file"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Transaction Info
                </p>
                <p className="text-sm font-medium text-gray-600">
                  ID: <span className="font-mono text-[11px]">{order._id}</span>
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
                <div className="mt-2 pt-2 border-t border-gray-50 space-y-1">
                  <p className="text-[11px] text-gray-500">
                    <span className="font-bold text-gray-400 uppercase">
                      Created:
                    </span>{" "}
                    {formatCustomDate(order.createdAt)}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    <span className="font-bold text-gray-400 uppercase">
                      Updated:
                    </span>{" "}
                    {formatCustomDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
            <p className="text-gray-400 font-medium">
              No {filter !== "all" ? filter : ""} orders currently on the
              platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
