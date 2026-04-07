const Order = require("../models/order.model");
const Artwork = require("../models/artwork.model");
const { sendMail } = require("../helpers/sendMail");
const instance = require("../config/razorpay");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
  try {
    const u_id = req.user.id;
    const { a_id, paymentMethod } = req.body;

    if (!u_id || !a_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const artwork = await Artwork.findById(a_id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const order = new Order({
      u_id,
      a_id,
      artist_id: artwork.u_id,
      artistName: artwork.artistName,
      title: artwork.title,
      price: artwork.price,
      paymentMethod: paymentMethod || "COD",
      orderStatus: "pending",
      paymentStatus: "unpaid"
    });

    await Artwork.findByIdAndUpdate(a_id, { isSold: true })
    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ u_id: req.user.id })
      .populate("a_id")
      .sort({ createdAt: -1 });
    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { returnDocument: 'after' }
    ).populate("u_id", "email firstName");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updates.orderStatus === "cancelled") {
      await Artwork.findByIdAndUpdate(updatedOrder.a_id, { isSold: false });
    }

    if (updates.orderStatus && updatedOrder.u_id?.email) {
      const userEmail = updatedOrder.u_id.email;
      const userName = updatedOrder.u_id.firstName;
      const subject = `Order Update: ${updates.orderStatus}`;
      const text = `Hello ${userName},\n\nYour order for "${updatedOrder.title} by ${updatedOrder.artistName}" has been ${updates.orderStatus}.\n\nThank you for shopping with us!`;

      sendMail(userEmail, subject, text);
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("a_id")
      .populate("u_id", "firstName lastName email phone address")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getArtistOrders = async (req, res) => {
  try {
    const { artist_id } = req.params;

    const orders = await Order.find({ artist_id })
      .populate("a_id")
      .populate("u_id", "firstName lastName phone address email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // const order = await Order.findOne({ _id: id });
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found or cannot be cancelled" });
    }

    await Artwork.findByIdAndUpdate(order.a_id, { 
      $set: { isSold: false } 
    });

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order cancelled and removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};


exports.processPayment = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100), //cents
    currency: "INR"
  }

  const order = await instance.orders.create(options)

  res.status(200).json({
    success: true,
    order
  })
}


exports.getKey = async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY
  })
}

exports.paymentVerification = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const { orderId } = req.query;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expected_signature = crypto.createHmac("sha256", process.env.RAZORPAY_SEC)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expected_signature === razorpay_signature;

  if (isAuthentic) {
    // Redirect and then immediately RETURN to stop execution
    return res.redirect(`https://pixel-box-git-main-devendra2553s-projects.vercel.app/paymentSuccess?reference=${razorpay_payment_id}&orderId=${orderId}`);
  } else {
    // Return here as well if the payment fails
    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }
  // Remove the extra res.status(200) that was down here!
};