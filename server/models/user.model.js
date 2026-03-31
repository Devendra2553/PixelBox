const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["artist", "customer", "admin"],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);