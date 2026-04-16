import React, { useEffect, useState } from "react";
import userBaseUrl from "../../../axioInstance";
import { Trash2, Search } from "lucide-react";

const AdminArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const res = await userBaseUrl.get(`/artworks`);
        setArtworks(res.data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    };

    fetchAllArtworks();
  }, []);

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
    const matchesStatus =
      filter === "all" ? true : filter === "sold" ? item.isSold : !item.isSold;

    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artistName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Manage All Artworks
          </h2>
          <p className="text-sm text-gray-500">
            Total: {artworks.length} items
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title or artist"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff751f]/50 transition bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {["all", "sold", "unsold"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-xl capitalize transition font-medium whitespace-nowrap ${
              filter === status
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredArt.length > 0 ? (
          filteredArt.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition group border border-gray-200"
            >
              <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2.5 rounded-full shadow-lg"
                >
                  <Trash2 size={18} />
                </button>

                <div
                  className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white ${
                    item.isSold ? "bg-green-600" : "bg-blue-600"
                  }`}
                >
                  {item.isSold ? "Sold" : "Available"}
                </div>
              </div>

              <div className="p-4 flex flex-col grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 truncate pr-2">
                    {item.title}
                  </h3>
                  <p className="font-bold text-[#ff751f]">₹{item.price}</p>
                </div>
                <p className="text-xs text-gray-500">
                  By{" "}
                  <span className="font-medium text-gray-700">
                    {item.artistName || "Unknown"}
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 uppercase mt-2 italic">
                  {item.category}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
            No artworks found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArtworks;
