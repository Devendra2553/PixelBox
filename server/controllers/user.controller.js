const User = require("../models/user.model");
const Artwork = require("../models/artwork.model");
const fs = require("fs");
const path = require("path");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { role, firstName, lastName, email, phone, address, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await User.create({
      role,
      firstName,
      lastName,
      email,
      phone,
      address,
      password
    });

    res.status(201).json({ message: "Registration successful", user });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log(users)
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    // 1. Added email and password to the destructured body
    const { firstName, lastName, phone, address, email, password } = req.body;

    // 2. Prepare the update object
    const updateData = { firstName, lastName, phone, address, email };

    // 3. Only add password to the update if it was actually provided
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Update artist name in artworks if name changes
    if (firstName || lastName) {
      const fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
      await Artwork.updateMany(
        { u_id: req.params.id },
        { $set: { artistName: fullName } }
      );
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Note: You can now delete the exports.updateProfilePhoto function 
// from your controller file and the corresponding route in user.routes.js


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};