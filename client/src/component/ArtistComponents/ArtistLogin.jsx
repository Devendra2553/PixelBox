import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userBaseUrl from "../../axioInstance";

const ArtistLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await userBaseUrl.post("/login", form);
      const { user } = res.data;

      if (user.role !== "artist") {
        alert("Access Denied: This is an Artist-only login.");
        return;
      }
      
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/artistpanel/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 hidden md:block">
        <img
          src="/images/image2.png"
          className="h-full w-full object-cover"
          alt="Artist Workspace"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <form className="w-full max-w-md space-y-5" onSubmit={handleLogin}>
          <h2 className="text-3xl font-bold text-[#ff751f]">Artist Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
          />

          <button
            type="submit"
            className="w-full bg-[#ff751f] text-white px-6 py-3 rounded-lg hover:bg-[#e66412] transition font-semibold"
          >
            Login to Dashboard
          </button>

          <Link
            to="/artistregister"
            className="w-full block text-center bg-white text-[#ff751f] p-3 rounded-lg border border-[#ff751f] hover:bg-[#ff751f] hover:text-white transition"
          >
            Don't have an artist account? Register here.
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ArtistLogin;
