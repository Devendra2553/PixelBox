import React, { useState } from "react";
import axios from "axios";

const AddArtwork = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection and generate preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Creates a temporary URL for previewing
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return alert("Please log in again.");

    const fName = user.firstName || "Unknown";
    const lName = user.lastName || "";
    const artistName = `${fName} ${lName}`.trim();

    const data = new FormData();
    data.append("u_id", user._id);
    data.append("artistName", artistName);
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/api/artworks", data);
      alert("Artwork uploaded successfully");

      // Reset everything after success
      setFormData({ title: "", category: "", price: "" });
      setImage(null);
      setPreview(""); 

      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="w-full md:w-[50%] mb-3">
      <h2 className="text-2xl font-semibold mb-6">Add An Artwork</h2>
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-4 mb-3 p-5 rounded-2xl bg-white shadow-md"
      >
        {/* Artwork Preview Box */}
        <div>
          <div className="md:row-span-4 flex justify-center mb-2">
            {preview ? (
              <div className="relative group w-full h-48 border-2 border-dashed border-[#ff751f] rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Artwork Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                Artwork Preview
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <input
            className="w-full border p-2 rounded-md border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <input
            className="w-full border p-2 rounded-md border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <input
            className="w-full border p-2 rounded-md border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />

          {/* Styled File Input */}
          <div className="w-full relative">
            <label className="cursor-pointer bg-white border font-bold border-[#ff751f] text-[#ff751f] py-2 px-4 rounded-md w-full block text-center hover:bg-[#ff751f] hover:text-white transition">
              {image ? "Change Image" : "Select Image"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                required={!image}
              />
            </label>
          </div>
        </div>

        <button
          className="w-full md:col-span-2 mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-[#e66412] transition font-semibold"
          type="submit"
        >
          Upload Artwork
        </button>
      </form>
    </div>
  );
};

export default AddArtwork;
