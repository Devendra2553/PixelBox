const Order = require("../models/order.model");
const Artwork = require("../models/artwork.model");

exports.createOrder = async (req, res) => {
  try {
    const { u_id, a_id, paymentMethod } = req.body;

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

    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { u_id } = req.params;

    const orders = await Order.find({ u_id })
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

    const allowedUpdates = [
      "orderStatus",
      "paymentStatus",
      "paymentMethod"
    ];

    const filteredUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      filteredUpdates,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder
    });

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
    const order = await Order.findOne({ _id: id });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found or cannot be cancelled" });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order cancelled and removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};