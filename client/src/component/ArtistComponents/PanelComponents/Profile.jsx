import React, { useState, useEffect } from "react";
import userBaseUrl from "../../../axioInstance";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userBaseUrl.get("/users/me");

        setFormData({
          ...res.data,
          password: "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let validatedValue = value;

    if (name === "firstName" || name === "lastName") {
      validatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "phone") {
      validatedValue = value.replace(/[^0-9]/g, "");
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = { ...formData };

      if (!updatePayload.password) {
        delete updatePayload.password;
      }

      const res = await userBaseUrl.patch(`/users/${userId}`, updatePayload);
      if (res.status === 200) {
        const updatedUser = { ...storedUser, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md hover:shadow-xl transition rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* First Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            First Name
          </label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Last Name
          </label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Phone Number
          </label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
        </div>

        {/* Email Address - Now Editable */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Email Address
          </label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>

        {/* Password - New Field */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            New Password (leave blank to keep current)
          </label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Artist Studio Address"
            rows="3"
            className="w-full p-3 border rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full md:col-span-2 mt-4 px-6 py-3 bg-[#ff751f] text-white rounded-lg hover:bg-[#e66412] transition font-bold shadow-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
