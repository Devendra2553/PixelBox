import React, { useEffect, useState } from "react";
import userBaseUrl from "../../../axioInstance";
import AddArtwork from "./AddArtwork";
import { Trash2 } from "lucide-react";

const Artwork = () => {
  const [artworks, setArtworks] = useState([]);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const artistId = user?._id;

  const API_BASE_URL = "http://localhost:5000/";

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await userBaseUrl.get(`/artworks`);

        const myArtworks = res.data.filter((a) => {
          const id = typeof a.u_id === "object" ? a.u_id._id : a.u_id;
          return id === artistId;
        });

        setArtworks(myArtworks);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    };

    if (artistId) {
      fetchArtworks();
    }
  }, [artistId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?"))
      return;
    try {
      await userBaseUrl.delete(`/artworks/${id}`);
      setArtworks(artworks.filter((art) => art._id !== id));
    } catch (err) {
      alert("Failed to delete artwork");
    }
  };

  const filteredArt = artworks.filter((item) => {
    if (filter === "sold") return item.isSold;
    if (filter === "unsold") return !item.isSold;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      <AddArtwork
        onUploadSuccess={(newArt) => setArtworks([newArt, ...artworks])}
      />

      <h2 className="text-2xl font-semibold mb-6 mt-6">Your Artworks</h2>

      <div className="flex gap-3 mb-6">
        {["all", "sold", "unsold"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl capitalize transition ${
              filter === status
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredArt.length > 0 ? (
          filteredArt.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition group"
            >
              <div className="relative w-full aspect-4/5 overflow-hidden">
                <img
                  src={`${API_BASE_URL}${item.imageUrl}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {!item.isSold && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                {item.isSold ? (
                  <span className="absolute bottom-2 right-2 bg-green-500/80 text-white text-xs px-3 py-1 rounded-full">
                    Sold
                  </span>
                ) : (
                  <span className="absolute bottom-2 right-2 bg-red-800 text-white text-xs px-3 py-1 rounded-full">
                    Unsold
                  </span>
                )}
              </div>

              <div className="flex flex-col grow p-4 space-y-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400 capitalize">
                    {item.category}
                  </p>
                  <p className="font-bold text-xl text-[#ff751f]">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-500">No artworks found.</p>
        )}
      </div>
    </div>
  );
};

export default Artwork;
