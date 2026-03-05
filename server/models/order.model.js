const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  u_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork",
    required: true
  },
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["placed", "pending", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "failed"],
    default: "unpaid"
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"]
  }
}, { timestamps: true });

module.exports =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);