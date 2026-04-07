import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import userBaseUrl from "../axioInstance";
import { Edit2, X } from "lucide-react";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [filter, setFilter] = useState("all");

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const storedUser = localStorage.getItem("user");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    password: "",
  });

  const userId = currentUser?._id;

  useEffect(() => {
    if (userId) fetchUserOrders();
  }, [userId]);

  const fetchUserOrders = async () => {
    try {
      const res = await userBaseUrl.get(`/orders/user/${userId}`);
      setOrders(res.data);

      const initialPayments = {};
      res.data.forEach((order) => {
        if (order.orderStatus === "pending") {
          initialPayments[order._id] = order.paymentMethod;
        }
      });
      setPaymentMethods(initialPayments);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = { ...profileForm };
      if (!updatePayload.password || updatePayload.password.trim() === "") {
        delete updatePayload.password;
      }

      const res = await userBaseUrl.patch(`/users/${userId}`, updatePayload);

      if (res.status === 200) {
        const updatedUser = { ...currentUser, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        setIsEditingProfile(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filteredOrders =
    filter === "all"
      ? sortedOrders
      : sortedOrders.filter((order) => order.orderStatus === filter);
  const visibleOrders = filteredOrders.filter(
    (order) => order.orderStatus.toLowerCase() !== "pending"
  );

  const handleUpdateStatusToCancelled = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const artworkId = order.a_id?._id || order.a_id;
    try {
      await userBaseUrl.put(`/orders/${order._id}`, {
        orderStatus: "cancelled",
      });
      if (artworkId)
        await userBaseUrl.patch(`/artworks/${artworkId}`, { isSold: false });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, orderStatus: "cancelled" } : o
        )
      );
      alert("Order cancelled.");
    } catch (err) {
      alert("Failed to cancel order.");
    }
  };

  const handleUpdatePayment = async (
    orderId,
    amount,
    fname,
    lname,
    email,
    phone
  ) => {
    try {
      if (paymentMethods[orderId] === "ONLINE") {
        const { data: keyData } = await userBaseUrl.get(`/v1/getkey`);
        const { data: orderData } = await userBaseUrl.post(
          `/v1/payment/process`,
          { amount }
        );
        const options = {
          key: keyData.key,
          amount,
          currency: "INR",
          name: `${fname} ${lname}`,
          order_id: orderData.order.id,
          callback_url: `https://pixelbox-ubua.onrender.com/api/orders/paymentVerification?orderId=${orderId}`,
          prefill: { name: `${fname} ${lname}`, email, contact: phone },
          theme: { color: "#F37254" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await userBaseUrl.put(`/orders/${orderId}`, {
          paymentMethod: paymentMethods[orderId],
          orderStatus: "placed",
        });
        alert("Your order has been placed successfully!");
        fetchUserOrders();
      }
    } catch (err) {
      alert("Failed to confirm order.");
    }
  };

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

  const statusColor = (status) => {
    switch (status) {
      case "placed":
        return "bg-yellow-100 text-yellow-600";
      case "shipped":
        return "bg-blue-100 text-blue-600";
      case "delivered":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* --- PROFILE SECTION --- */}
          {storedUser && (
            <div className="  bg-white rounded-2xl shadow-md p-6 border-b-4 border-[#ff751f] mx-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Information
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-2 text-sm font-bold text-[#ff751f] hover:underline"
                >
                  {isEditingProfile ? (
                    <>
                      <X size={16} /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} /> Edit
                    </>
                  )}
                </button>
              </div>

              {isEditingProfile ? (
                <form
                  onSubmit={handleProfileUpdate}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300"
                >
                  <input
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    className="border p-2.5 rounded-xl outline-none focus:ring-2 ring-orange-200"
                    placeholder="First Name"
                    required
                  />
                  <input
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    className="border p-2.5 rounded-xl outline-none focus:ring-2 ring-orange-200"
                    placeholder="Last Name"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="border p-2.5 rounded-xl outline-none focus:ring-2 ring-orange-200"
                    placeholder="Email"
                    required
                  />
                  <input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="border p-2.5 rounded-xl outline-none focus:ring-2 ring-orange-200"
                    placeholder="Phone"
                    required
                  />
                  <textarea
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    className="border p-2.5 rounded-xl md:col-span-2 outline-none focus:ring-2 ring-orange-200"
                    placeholder="Delivery Address"
                    rows="2"
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    value={profileForm.password}
                    onChange={handleProfileChange}
                    className="border p-2.5 rounded-xl md:col-span-2 outline-none focus:ring-2 ring-orange-200"
                    placeholder="New Password (leave blank to keep current)"
                  />
                  <button
                    type="submit"
                    className="md:col-span-2 bg-[#ff751f] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#e66412] transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400">
                        Name
                      </p>
                      <p className="font-semibold text-sm capitalize">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400">
                        Contact
                      </p>
                      <p className="font-semibold text-sm">
                        {currentUser?.email}
                      </p>
                      <p className="text-gray-800 text-sm">
                        +91 {currentUser?.phone}
                      </p>
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-[10px] uppercase font-black text-gray-400">
                        Default Address
                      </p>
                      <p className="text-gray-800 text-sm italic capitalize leading-snug">
                        {currentUser?.address || "No address set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- CART SECTION --- */}
          <div className="max-w-5xl mx-5 bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
            {sortedOrders.filter((order) => order.orderStatus === "pending")
              .length === 0 ? (
              <div className="text-center py-10 rounded-xl border-2 border-gray-200">
                <p className="text-gray-500 font-medium">Your cart is empty.</p>
                <p className="text-sm text-gray-400">
                  You can track your order history from below.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedOrders
                  .filter((item) => item.orderStatus === "pending")
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col md:flex-row md:items-center justify-between bg-gray-100 p-5 rounded-2xl border border-gray-200 gap-6"
                    >
                      {/* Left Section: Artwork Info */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 rounded-xl object-cover shadow-sm"
                        />
                        <div>
                          <h2 className="font-bold text-gray-800">
                            {item.title}
                          </h2>
                          <p className="text-[#ff751f] font-black text-lg">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>

                      {/* Middle Section: Payment & Delivery */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-1">
                            Payment Method
                          </p>
                          <div className="flex gap-4">
                            {["COD", "ONLINE"].map((method) => (
                              <label
                                key={method}
                                className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700"
                              >
                                <input
                                  type="radio"
                                  name={`payment-${item._id}`}
                                  value={method}
                                  checked={paymentMethods[item._id] === method}
                                  onChange={(e) =>
                                    setPaymentMethods({
                                      ...paymentMethods,
                                      [item._id]: e.target.value,
                                    })
                                  }
                                />
                                {method}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-300 md:w-64 lg:w-72">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Delivery Information
                          </p>
                          <p className="text-sm text-gray-700 font-bold capitalize mt-1">
                            {currentUser?.firstName} {currentUser?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 italic leading-relaxed truncate md:whitespace-normal">
                            {currentUser?.address}
                          </p>
                        </div>
                      </div>

                      {/* Right Section: Action Buttons */}
                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                          onClick={() =>
                            handleUpdatePayment(
                              item._id,
                              item.price,
                              currentUser?.firstName,
                              currentUser?.lastName,
                              currentUser?.email,
                              currentUser?.phone
                            )
                          }
                          className="w-full md:px-8 py-3 bg-[#ff751f] text-white rounded-xl font-bold hover:bg-[#e66412] transition active:scale-95"
                        >
                          {paymentMethods[item._id] === "ONLINE"
                            ? "Pay Online"
                            : "Confirm Order"}
                        </button>

                        <button
                          onClick={() => handleUpdateStatusToCancelled(item)}
                          className="w-full md:px-8 py-3 text-red-500 font-bold border border-red-200 rounded-xl hover:bg-red-50 transition active:scale-95"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* --- ORDER HISTORY SECTION --- */}
            <div className="mt-12 border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Order History</h1>
                <select
                  className="bg-gray-200 outline-none text-black px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {["all", "placed", "shipped", "delivered", "cancelled"].map(
                    (filtered) => (
                      <option
                        key={filtered}
                        className="bg-white text-black"
                        value={filtered}
                      >
                        {filtered.charAt(0).toUpperCase() + filtered.slice(1)}
                      </option>
                    )
                  )}
                </select>
              </div>
              {visibleOrders.length === 0 ? (
                <p className="text-gray-400 italic">
                  You haven't placed any orders yet.
                </p>
              ) : (
                <div className="space-y-3 capitalize">
                  {visibleOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-4"
                    >
                      {/* Left Side: Image and Info */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={order.a_id?.imageUrl}
                          alt={order.title}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-100"
                        />
                        <div className="space-y-0.5">
                          <h2 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                            {order.title}{" "}
                            <span className="text-gray-400 font-normal">
                              by
                            </span>{" "}
                            {order.artistName}
                          </h2>
                          <p className="text-[#ff751f] text-sm font-black">
                            ₹{order.price}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {order.paymentMethod} Payment
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Status and Dates */}
                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 text-[10px] rounded-full font-black uppercase tracking-tighter ${statusColor(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                          {order.orderStatus !== "delivered" &&
                            order.orderStatus !== "cancelled" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatusToCancelled(order)
                                }
                                className="text-[10px] text-red-500 bg-red-50 px-3 py-1 rounded-full font-bold uppercase hover:bg-red-500 hover:text-white transition"
                              >
                                Cancel
                              </button>
                            )}
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] text-gray-400 leading-tight">
                            <span className="font-black">PLACED:</span>{" "}
                            {formatCustomDate(order.createdAt)}
                          </p>
                          <p className="text-[9px] text-gray-400 leading-tight">
                            <span className="font-black">UPDATED:</span>{" "}
                            {formatCustomDate(order.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
