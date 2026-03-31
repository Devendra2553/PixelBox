import React, { useEffect, useState } from "react";
import userBaseUrl from "../axioInstance";
import { Search, ChevronDown, RotateCcw } from "lucide-react";

const CardGrid = () => {
  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedArtist, setSelectedArtist] = useState("Artist");

  const API_BASE_URL = "http://localhost:5000/";

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await userBaseUrl.get("/artworks");
        setArtworks(res.data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  const categories = ["Category", ...new Set(artworks.map((a) => a.category))];
  const artists = ["Artist", ...new Set(artworks.map((a) => a.artistName))];

  const filteredArt = artworks.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      (item.artistName || "").toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === "Category" || item.category === selectedCategory;

    const matchesArtist =
      selectedArtist === "Artist" || item.artistName === selectedArtist;

    return matchesSearch && matchesCategory && matchesArtist;
  });

  const handleBuy = async (artworkId, artistId, isSold) => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login first");
        return;
      }

      const user = JSON.parse(storedUser);

      if (isSold) {
        alert("This artwork is sold out");
        return;
      }

      const ordersRes = await userBaseUrl.get(`/orders/user/${user._id}`);
      const existingOrders = ordersRes.data;

      const activeOrder = existingOrders.find((order) => {
        const matchId =
          order.a_id?._id === artworkId || order.a_id === artworkId;
        return matchId && order.orderStatus !== "cancelled";
      });

      if (activeOrder) {
        alert("Artwork already in cart or currently being processed.");
        return;
      }

      await userBaseUrl.patch(`/artworks/${artworkId}`, { isSold: true });

      await userBaseUrl.post("/orders", {
        u_id: user._id,
        a_id: artworkId,
        artist_id: artistId,
        paymentMethod: "COD",
        orderStatus: "pending",
      });

      alert("Order added to cart successfully");
    } catch (error) {
      console.error("Order failed:", error);
      alert(
        "Order failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading Artworks...</div>;

  return (
    <div className="w-full md:w-5xl mx-auto px-6 py-10">
      {/* Search Bar */}
      <div className="w-full flex justify-center mt-6">
        <div className="relative w-full md:w-1/2 mx-5">
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or artist..."
            className="w-full pl-5 pr-14 py-3 rounded-full border border-[#ff751f] focus:outline-none focus:ring-2 focus:ring-[#ff751f]/30"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff751f] text-white p-2 rounded-full hover:bg-[#e66412] transition">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="w-full flex justify-center mt-6 relative z-40">
        <div className="flex items-center bg-[#ff751f] rounded-full px-3 py-2 gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(open === "category" ? null : "category")}
              className="bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-2 max-w-30"
            >
              <span className="truncate capitalize whitespace-nowrap">
                {selectedCategory}
              </span>
              <ChevronDown size={16} />
            </button>
            {open === "category" && (
              <div className="absolute top-full mt-2 w-40 bg-white text-black rounded-xl shadow-xl p-2 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpen(null);
                    }}
                    className="block w-full capitalize text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artist Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(open === "artist" ? null : "artist")}
              className="bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-2 max-w-30"
            >
              <span className="truncate capitalize whitespace-nowrap">
                {selectedArtist}
              </span>
              <ChevronDown size={16} />
            </button>
            {open === "artist" && (
              <div className="absolute top-full mt-2 w-40 bg-white text-black rounded-xl shadow-xl p-2 space-y-1">
                {artists.map((art) => (
                  <button
                    key={art}
                    onClick={() => {
                      setSelectedArtist(art);
                      setOpen(null);
                    }}
                    className="block w-full capitalize text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {art}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedCategory("Category");
              setSelectedArtist("Artist");
              setSearchTerm("");
            }}
            className="bg-white text-[#ff751f] p-1 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {filteredArt.length > 0 ? (
          filteredArt.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition"
            >
              <div className="relative w-full aspect-4/5 overflow-hidden">
                <img
                  src={`${API_BASE_URL}${item.imageUrl}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.isSold && (
                  <span className="absolute bottom-2 right-2 bg-red-500/50 text-white text-xs px-3 py-1 rounded-full">
                    Sold
                  </span>
                )}
              </div>

              <div className="flex flex-col grow p-4 space-y-1">
                <h3 className="font-semibold capitalize text-lg">{item.title}</h3>
                <h5 className="font-md capitalize text-sm">{item.category}</h5>
                <h5 className="text-md capitalize text-gray-500">
                  {item?.artistName || "Unknown Artist"}
                </h5>
                <p className="font-bold text-xl text-[#ff751f] pt-1">
                  ₹{item.price}
                </p>
                <div className="grow" />
                <button
                  onClick={() => handleBuy(item._id, item.u_id, item.isSold)}
                  className={`w-full py-2 rounded-xl transition ${
                    item.isSold
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#ff751f] text-white hover:bg-[#e66412]"
                  }`}
                >
                  {item.isSold ? "Sold Out" : "Buy Now"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            No artworks found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CardGrid;