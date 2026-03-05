import React, { useState, useEffect } from "react";
import userBaseUrl from "../../../axioInstance";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    profileImage: ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userBaseUrl.get("/"); 
        const currentUser = res.data.find(u => u._id === userId);
        
        if (currentUser) {
          setFormData(currentUser);
          if (currentUser.profileImage) {
            setPreview(`http://localhost:5000/${currentUser.profileImage}`);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle local file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Create a local URL for the preview
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;
  
    const uploadData = new FormData();
    uploadData.append("profileImage", selectedFile);
  
    try {
      const res = await userBaseUrl.patch(`/${userId}/photo`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (res.status === 200) {
        const updatedUser = { ...storedUser, profileImage: res.data.profileImage };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSelectedFile(null);
        alert("Profile photo updated!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await userBaseUrl.patch(`/${userId}`, formData);
      if (res.status === 200) {
        const updatedUser = { ...storedUser, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const defaultPhoto = `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=ff751f&color=fff&size=200`;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md hover:shadow-xl transition rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative group cursor-pointer">
          <img
            src={preview || defaultPhoto}
            className="w-40 h-40 rounded-full object-cover border-4 border-[#ff751f]/20 shadow-sm transition group-hover:brightness-75"
            alt="Artist Profile"
          />
          {/* Overlay to trigger file input */}
          <label className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 font-semibold transition">
            Change Photo
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Show Confirm button only when a new file is picked */}
        {selectedFile && (
          <div className="flex gap-2">
            <button 
              onClick={handlePhotoUpload}
              className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-green-600 transition"
            >
              Confirm Upload
            </button>
            <button 
              onClick={() => {
                setSelectedFile(null);
                setPreview(formData.profileImage ? `http://localhost:5000/${formData.profileImage}` : "");
              }}
              className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">First Name</label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">Last Name</label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">Phone Number</label>
          <input
            className="w-full border p-3 rounded-lg border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
          <input
            className="w-full border p-3 rounded-lg bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed"
            name="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">Address</label>
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