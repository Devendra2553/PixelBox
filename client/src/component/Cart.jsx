import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import userBaseUrl from "../axioInstance";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

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

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredOrders =
    filter === "all"
      ? sortedOrders
      : sortedOrders.filter((order) => order.orderStatus === filter);

  const handleUpdateStatusToCancelled = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const artworkId = order.a_id?._id || order.a_id;

    try {
      await userBaseUrl.put(`/orders/${order._id}`, {
        orderStatus: "cancelled",
      });

      if (artworkId) {
        await userBaseUrl.patch(`/artworks/${artworkId}`, {
          isSold: false,
        });
      }

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id ? { ...o, orderStatus: "cancelled" } : o
        )
      );

      alert("Order cancelled.");
      window.location.reload();
    } catch (err) {
      console.error("Error cancelling order:", err);
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
      if (paymentMethods[orderId] == "ONLINE") {
        const { data: keyData } = await userBaseUrl.get(`/v1/getkey`);
        const { key } = keyData;
        console.log(key);

        const { data: orderData } = await userBaseUrl.post(
          `/v1/payment/process`,
          { amount }
        );
        const { order } = orderData;
        console.log(order);

        const options = {
          key: key,
          amount: amount,
          currency: "INR",
          name: fname + " " + lname,
          description: "Test Transaction",
          order_id: order.id,
          callback_url: `http://localhost:5000/api/v1/paymentVerification?orderId=${orderId}`,
          prefill: {
            name: fname + " " + lname,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        await userBaseUrl.put(`/orders/${orderId}`, {
          paymentMethod: paymentMethods[orderId],
          orderStatus: "placed",
        });
        alert("Your order has been placed successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to confirm order. Please try again.");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "placed":
        return "bg-gray-300 text-black-600";
      case "pending":
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

  const visibleOrders = filteredOrders.filter(
    (order) => order.orderStatus.toLowerCase() !== "pending"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-15 md:pt-20">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
          {/* CART SECTION */}
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
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-xl"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={`http://localhost:5000/${item.a_id?.imageUrl}`} // Map to server path
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="font-semibold">{item.title}</h2>
                        <p className="text-sm text-gray-500">{item.artist}</p>
                        <p className="text-orange-500 font-medium">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <p className="text-sm font-medium text-gray-700">
                        Change Payment Method:
                      </p>
                      <div className="flex gap-4">
                        {["COD", "ONLINE"].map((method) => (
                          <label
                            key={method}
                            className="flex items-center gap-2 cursor-pointer text-sm"
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

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Delivery Information
                        </p>
                        <p className="text-sm text-gray-600 font-bold capitalize">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 italic capitalize">
                          {user?.address}.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          handleUpdatePayment(
                            item._id,
                            item.price,
                            user?.firstName,
                            user?.lastName,
                            user?.email,
                            user?.phone
                          )
                        }
                        className="bg-[#ff751f] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#e66412] transition-colors shadow-sm"
                      >
                        {paymentMethods[item._id] === "ONLINE"
                          ? "Pay Online"
                          : "Confirm Order"}
                      </button>

                      <button
                        onClick={() => handleUpdateStatusToCancelled(item)} // Changed from handleCancelOrder
                        className="text-red-500 border border-red-200 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ORDER HISTORY SECTION */}
          <div className="mt-12 border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Order History</h1>

              <select
                className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option className="bg-white text-black" value="all">
                  All Orders
                </option>
                <option className="bg-white text-black" value="pending">
                  Pending
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
            </div>

            {visibleOrders.length === 0 ? (
              <p className="text-gray-400 italic">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {visibleOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={`http://localhost:5000/${order.a_id?.imageUrl}`}
                        alt={order.title}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                      />
                      <div>
                        <h2 className="font-semibold">{order.title}</h2>
                        <p className="text-xs text-gray-500">
                          Artist: {order.artistName}
                        </p>
                        <p className="text-[#ff751f] text-sm font-semibold">
                          ₹{order.price}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">
                          Method: {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-4 py-1 text-[10px] rounded-full font-bold uppercase ${statusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      {/* Only show Cancel button if status is NOT delivered AND NOT already cancelled */}
                      {order.orderStatus !== "delivered" &&
                        order.orderStatus !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatusToCancelled(order)}
                            className="text-[10px] text-white bg-red-500 px-4 py-1 rounded-full font-bold uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
