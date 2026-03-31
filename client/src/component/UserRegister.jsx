import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userBaseUrl from "../axioInstance";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let validatedValue = value;

    if (name === "firstName" || name === "lastName") {
      validatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "phone") {
      validatedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await userBaseUrl.post("/users/register", formData);
      navigate("/userlogin");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <>
      <div className="min-h-screen flex justify-end">
        <div className="w-1/2 md:h-screen hidden md:block md:fixed md:left-0 md:top-0">
          <img
            src="/images/image1.png"
            className="h-full w-full object-cover"
            alt="Side image"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 md:ml[50%]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full max-w-md space-y-3"
          >
            <h2 className="text-3xl font-bold text-[#ff751f]">Register</h2>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter your address"
              className="w-full p-3 border translate-y-1 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30 resize-none"
            ></textarea>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            />

            <button className="w-full mt-3 bg-[#ff751f] text-white px-6 py-3 rounded-lg hover:bg-[#e66412] transition">
              Register
            </button>

            <Link
              to="/userlogin"
              className="w-full block text-center bg-white text-[#ff751f] p-3 rounded-lg border border-[#ff751f] hover:bg-[#ff751f] hover:text-white transition"
            >
              Already Registered? Log in here.
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
